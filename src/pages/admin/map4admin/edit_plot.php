<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include __DIR__ . '/../config.php';

// Get and decode input
$data = json_decode(file_get_contents('php://input'), true);

// Check for JSON decode errors
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit();
}

// 🔍 Validate required fields
$required_fields = ['plot_id', 'category', 'length', 'width', 'area', 'status'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || $data[$field] === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit();
    }
}

try {
    $conn->begin_transaction();

    // 🔧 Update plot details in tbl_plots (not tbl_plot)
    $update_plot = $conn->prepare(
        "UPDATE `tbl_plots` SET `category`=?, `length`=?, `width`=?, `area`=?, `status`=?, `label`=?, `updated_at`=NOW() WHERE `plot_id`=?"
    );

    if (!$update_plot) {
        throw new Exception("SQL error preparing plot update: " . $conn->error);
    }

    $update_plot->bind_param(
        "sssssss",
        $data['category'],
        $data['length'],
        $data['width'],
        $data['area'],
        $data['status'],
        $data['label'] ?? null,
        $data['plot_id']
    );

    if (!$update_plot->execute()) {
        throw new Exception("Failed to update plot: " . $update_plot->error);
    }

    // 🖼️ Handle media updates if file_names_array is provided
    if (isset($data['file_names_array']) && is_array($data['file_names_array'])) {
        // 🗑️ Remove existing media for this plot
        $delete_media = $conn->prepare("DELETE FROM `tbl_media` WHERE `plot_id`=?");
        if (!$delete_media) {
            throw new Exception("SQL error preparing media delete: " . $conn->error);
        }
        
        $delete_media->bind_param("s", $data['plot_id']);
        $delete_media->execute();
        $delete_media->close();

        // 📷 Insert new media files
        if (!empty($data['file_names_array'])) {
            $insert_media = $conn->prepare("INSERT INTO `tbl_media` (`plot_id`, `file_name`, `created_at`) VALUES (?, ?, NOW())");
            if (!$insert_media) {
                throw new Exception("SQL error preparing media insert: " . $conn->error);
            }

            foreach ($data['file_names_array'] as $file_name) {
                if (!empty($file_name)) {
                    $insert_media->bind_param("ss", $data['plot_id'], $file_name);
                    if (!$insert_media->execute()) {
                        throw new Exception("Failed to insert media: " . $insert_media->error);
                    }
                }
            }
            $insert_media->close();
        }
    }

    // 📊 Fetch updated plot with media
    $fetch_plot = $conn->prepare("
        SELECT 
            p.*, 
            GROUP_CONCAT(m.file_name) AS file_names
        FROM tbl_plots p
        LEFT JOIN tbl_media m ON p.plot_id = m.plot_id
        WHERE p.plot_id = ?
        GROUP BY p.plot_id
    ");
    
    if (!$fetch_plot) {
        throw new Exception("SQL error preparing plot fetch: " . $conn->error);
    }

    $fetch_plot->bind_param("s", $data['plot_id']);
    $fetch_plot->execute();
    $result = $fetch_plot->get_result();
    
    if ($result && $result->num_rows > 0) {
        $updated_plot = $result->fetch_assoc();
        // 📸 Convert comma-separated file names to array
        $updated_plot['file_names_array'] = $updated_plot['file_names'] ? explode(',', $updated_plot['file_names']) : [];
        
        $conn->commit();
        echo json_encode([
            'success' => true,
            'message' => 'Plot updated successfully',
            'plot' => $updated_plot
        ]);
    } else {
        throw new Exception("Failed to fetch updated plot");
    }

    $fetch_plot->close();
    $update_plot->close();

} catch (Exception $e) {
    $conn->rollback();
    error_log("Plot update error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to update plot: ' . $e->getMessage()
    ]);
}

$conn->close();
?>