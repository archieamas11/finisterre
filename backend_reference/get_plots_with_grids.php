<?php
// 🏗️ Backend reference: Get all plots with valid rows and columns
include __DIR__ . '/../config.php';

$stmt = $conn->prepare("SELECT
    plot_id,
    `rows`,
    `columns`
FROM
    tbl_plots
WHERE
    `rows` IS NOT NULL AND `rows` <> ''
    AND `columns` IS NOT NULL AND `columns` <> ''
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
        $plots[] = [
            'plot_id' => $row['plot_id'],
            'rows' => (int)$row['rows'],
            'columns' => (int)$row['columns'],
            'total_niches' => (int)$row['rows'] * (int)$row['columns']
        ];
    }
    echo json_encode([
        "success" => true, 
        "message" => "Plots with grids found", 
        "plots" => $plots,
        "count" => count($plots)
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No plots with valid grid dimensions found"]);
}
$conn->close();
?>
