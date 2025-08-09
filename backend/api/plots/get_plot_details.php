<?php
include __DIR__ . '/../config.php';
// Get plot_id from JSON body or POST form data
$data = json_decode(file_get_contents('php://input'), true);
$plotId = null;

if (isset($data['plot_id'])) {
    $plotId = $data['plot_id'];
} elseif (isset($_POST['plot_id'])) {
    $plotId = $_POST['plot_id'];
}

if (!$plotId) {
    echo json_encode([
        "success" => false, 
        "message" => "Invalid plot_id parameter"
    ]);
    exit();
}

try {
    // Query to get owner information from tbl_lot joined with tbl_customers
    $ownerQuery = "
        SELECT 
            c.customer_id,
            CONCAT(c.first_name, ' ', IFNULL(c.middle_name, ''), ' ', c.last_name) as fullname,
            c.email,
            c.contact_number as contact
        FROM tbl_lot l
        JOIN tbl_customers c ON l.customer_id = c.customer_id
        WHERE l.plot_id = ?
        ORDER BY l.created_at DESC
        LIMIT 1
    ";
    
    $ownerStmt = $conn->prepare($ownerQuery);
    if (!$ownerStmt) {
        throw new Exception("SQL prepare error for owner query: " . $conn->error);
    }
    
    $ownerStmt->bind_param("i", $plotId);
    $ownerStmt->execute();
    $ownerResult = $ownerStmt->get_result();
    
    $owner = null;
    if ($ownerResult && $ownerResult->num_rows > 0) {
        $owner = $ownerResult->fetch_assoc();
    }
    
    // Query to get deceased information from tbl_deceased joined with tbl_lot
    $deceasedQuery = "
        SELECT 
            d.deceased_id,
            d.dead_fullname,
            d.dead_gender,
            d.dead_citizenship,
            d.dead_civil_status,
            d.dead_relationship,
            d.dead_message,
            d.dead_bio,
            d.dead_profile_link,
            d.dead_interment,
            d.dead_birth_date,
            d.dead_date_death
        FROM tbl_deceased d
        JOIN tbl_lot l ON d.lot_id = l.lot_id
        WHERE l.plot_id = ?
        ORDER BY d.created_at DESC
        LIMIT 1
    ";
    
    $deceasedStmt = $conn->prepare($deceasedQuery);
    if (!$deceasedStmt) {
        throw new Exception("SQL prepare error for deceased query: " . $conn->error);
    }
    
    $deceasedStmt->bind_param("i", $plotId);
    $deceasedStmt->execute();
    $deceasedResult = $deceasedStmt->get_result();
    
    $deceased = null;
    if ($deceasedResult && $deceasedResult->num_rows > 0) {
        $deceased = $deceasedResult->fetch_assoc();
    }
    
    // Response
    echo json_encode([
        "success" => true,
        "message" => "Plot details retrieved successfully",
        "plot_id" => $plotId,
        "owner" => $owner,
        "deceased" => $deceased
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} finally {
    if (isset($ownerStmt)) $ownerStmt->close();
    if (isset($deceasedStmt)) $deceasedStmt->close();
    $conn->close();
}
?>