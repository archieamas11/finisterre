<?php
include __DIR__ . '/../config.php';

// Get and decode input
$data = json_decode(file_get_contents('php://input'), true);
// Basic input validation
$required_fields = ['dead_fullname', 'lot_id', 'dead_gender', 'dead_interment', 'dead_birth_date', 'dead_date_death'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit();
    }
}

// Check for JSON decode errors
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit();
}

// Insert new deceased record
$insert = $conn->prepare("INSERT INTO `tbl_deceased`(`lot_id`, `dead_fullname`, `dead_gender`, `dead_interment`, `dead_birth_date`, `dead_date_death`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");

if (!$insert) {
    echo json_encode(["success" => false, "message" => "SQL error", "error" => $conn->error]);
    $conn->close();
    exit();
}

$insert->bind_param(
    "ssssss",
    $data['lot_id'],
    $data['dead_fullname'],
    $data['dead_gender'],
    $data['dead_interment'],
    $data['dead_birth_date'],
    $data['dead_date_death']
);
$insert->execute();

if ($insert->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Deceased record created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to create deceased record"]);
}

$insert->close();
$conn->close();
?>