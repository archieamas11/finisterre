<?php
include __DIR__ . '/../config.php';

$stmt = $conn->prepare("
    SELECT 
        p.*, 
        GROUP_CONCAT(m.file_name) AS file_names
    FROM tbl_plots p
    LEFT JOIN tbl_media m ON p.plot_id = m.plot_id
    GROUP BY p.plot_id
");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL error", "error" => $conn->error]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $plots = [];
    while ($row = $result->fetch_assoc()) {
        // Convert comma-separated file names to array
        $row['file_names_array'] = $row['file_names'] ? explode(',', $row['file_names']) : [];
        $plots[] = $row;
    }
    echo json_encode(["success" => true, "message" => "available plots found", "plots" => $plots]);
} else {
    echo json_encode(["success" => false, "message" => "no available plots found"]);
}
$conn->close();
?>