<?php
include __DIR__ . '/../config.php';
$data = json_decode(file_get_contents('php://input'), true);

$stmt = $conn->prepare("SELECT p.*, n.*, c.*, d.*,
    CONCAT(
        c.first_name,
        ' ',
        c.middle_name,
        ' ',
        c.last_name
    ) AS customer_name
FROM
    tbl_lot AS l
JOIN tbl_customers AS c
ON
    c.customer_id = l.customer_id
LEFT JOIN tbl_plots AS p
ON
    p.plot_id = l.plot_id
LEFT JOIN tbl_deceased AS d
ON
    d.lot_id = l.lot_id
LEFT JOIN tbl_niche AS n
ON
    p.plot_id = n.plot_id;
");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL error", "error" => $conn->error]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $LotOwners = [];
    while ($row = $result->fetch_assoc()) {
        $LotOwners[] = $row;
    }
    echo json_encode(["success" => true, "message" => "lot data found", "lotOwners" => $LotOwners]);
} else {
    echo json_encode(["success" => false, "message" => "lot not found"]);
}
$conn->close();
?>