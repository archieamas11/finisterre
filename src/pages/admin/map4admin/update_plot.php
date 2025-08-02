<?php
include __DIR__ . '/../config.php';

// Get and decode input
$data = json_decode(file_get_contents('php://input'), true);

// Check for JSON decode errors
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit();
}

// Basic input validation for plot fields
$required_fields = ['category', 'length', 'width', 'area', 'status'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit();
    }
}

// Update plot using prepared statement
$update = $conn->prepare(
    "UPDATE `tbl_plot` SET `category`=?, `length`=?, `width`=?, `area`=?, `status`=?, `label`=?, `updated_at`=NOW() WHERE `plot_id`=?"
);

if (!$update) {
    echo json_encode(["success" => false, "message" => "SQL error", "error" => $conn->error]);
    $conn->close();
    exit();
}

$update->bind_param(
    "sdddssi",
    $data['category'],
    $data['length'],
    $data['width'],
    $data['area'],
    $data['status'],
    $data['label'] ?? null,
    $data['plot_id'],
);

if ($update->execute()) {
    // Fetch media for this plot_id
    $media_stmt = $conn->prepare("SELECT file_name FROM tbl_media WHERE plot_id = ?");
    $media_stmt->bind_param("i", $data['plot_id']);
    $media_stmt->execute();
    $media_result = $media_stmt->get_result();
    $media = [];
    while ($row = $media_result->fetch_assoc()) {
        $media[] = $row;
    }
    $media_stmt->close();

    echo json_encode([
        'success' => true,
        'id' => $data['plot_id'],
        'media' => $media
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$update->close();
$conn->close();