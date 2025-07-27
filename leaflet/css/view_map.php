<?php 
include_once 'include/config.php';
include_once 'include/database.php'; 
    // Fetch all blocks dynamically
    $blocks_query = "SELECT DISTINCT block FROM grave_points ORDER BY block ASC";
    $blocks_result = mysqli_query($mysqli, $blocks_query);
?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="stylesheet" crossorigin href="assets/compiled/css/app.css">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="webmap/css/leaflet.css">
    <link rel="stylesheet" href="webmap/css/L.Control.Locate.min.css">
    <link rel="stylesheet" href="webmap/css/qgis2web.css">
    <link rel="stylesheet" href="webmap/css/fontawesome-all.min.css">
    <link rel="stylesheet" href="webmap/css/leaflet-control-geocoder.Geocoder.css">
    <link rel="stylesheet" href="webmap/css/leaflet-search.css">
    <link rel="stylesheet" href="assets/css/popup-modal.css?=v1.0">
    <link rel="stylesheet" href="assets/css/legend.css">
    <link rel="stylesheet" href="assets/css/floating-navbar.css">
    <link rel="stylesheet" href="webmap/css/Leaflet.AnimatedSearchBox.css">
    <title>CemeterEase - Map</title>
</head>

<body>
    <main class="map-page">
        <div class="searchbar-container">
            <div class="searchbar" id="search-container"></div>
            <!-- Navigation Buttons -->
            <div class="floating-navbar">
                <a href="#" class="nav-button search-btn" data-bs-toggle="modal" data-bs-target="#advancedSearchModal"
                    title="Advanced Search" aria-label="Advanced Search">
                    <i class="bi bi-sliders"></i>
                    <span class="button-label">Advanced</span>
                </a>
                <a href="index.html" class="nav-button home-btn" title="Home" aria-label="Go to Home">
                    <i class="bi bi-house-fill"></i>
                    <span class="button-label">Home</span>
                </a>
                <a href="login/index.php" class="nav-button signin-btn" title="Sign In" aria-label="Sign In">
                    <i class="bi bi-person-fill"></i>
                    <span class="button-label">Sign In</span>
                </a>
            </div>
        </div>
        <div class="page-container">
            <div class="legend" id="mapLegend">
                <div class="card">
                    <div class="card-header py-2">
                        <h6 class="mb-0 d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-map me-2"></i>Legend</span>
                            <button class="btn btn-sm btn-link p-0" id="minimizeLegend">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                        </h6>
                    </div>
                    <div class="card-body p-3" id="legendContent">
                        <div class="legend-item mb-2">
                            <span class="legend-color available"></span>
                            <span class="legend-label">Available Plots</span>
                        </div>
                        <div class="legend-item mb-2">
                            <span class="legend-color occupied"></span>
                            <span class="legend-label">Occupied</span>
                        </div>
                        <div class="legend-item mb-2">
                            <span class="legend-color reserved"></span>
                            <span class="legend-label">Reserved</span>
                        </div>
                        <div class="legend-item mb-2">
                            <span class="legend-color road"></span>
                            <span class="legend-label">Road/Path</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color landmark"></span>
                            <span class="legend-label">Landmark</span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="map" class="map"></div>
        </div>
        <!-- Advanced Search Modal -->
        <div class="modal fade" id="advancedSearchModal" tabindex="-1" aria-labelledby="advancedSearchModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="advancedSearchModalLabel"><i class="bi bi-search me-2"></i>Advanced Search</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Advanced Search:</strong> Please fill at least 3 fields for more accurate and
                            specific search results.
                        </div>
                        <!-- Form content -->
                        <div class="mb-3">
                            <label for="nameSearch" class="form-label">Deceased Name</label>
                            <div class="form-group position-relative has-icon-left">
                                <input type="text" class="form-control" placeholder="Enter full name or partial name"
                                    aria-label="Deceased Name" id="nameSearch">
                                <div class="form-control-icon">
                                    <i class="bi bi-person"></i>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <label for="graveBlockFilter" class="form-label">Block</label>
                                    <select class="form-select" id="graveBlockFilter">
                                        <option hidden value="">Select Blocks</option>
                                        <?php
                                        if ($blocks_result && mysqli_num_rows($blocks_result) > 0) {
                                            while ($block = mysqli_fetch_assoc($blocks_result)) {
                                                echo '<option value="' . htmlspecialchars($block['block']) . '">Block ' . htmlspecialchars($block['block']) . '</option>';
                                            }
                                        }
                                        ?>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="graveIdSearch" class="form-label">Grave ID</label>
                                    <div class="form-group position-relative has-icon-left">
                                        <input type="text" class="form-control" placeholder="Enter grave ID"
                                            id="graveIdSearch">
                                        <div class="form-control-icon">
                                            <i class="bi bi-hash"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="genderFilter" class="form-label">Gender</label>
                            <select class="form-select" id="genderFilter">
                                <option hidden value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="birthYearFrom" class="form-label">Birth Date</label>
                            <div class="input-group">
                                <input type="date" class="form-control" placeholder="From year" id="birthYearFrom"
                                    min="1800" max="2025">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="reset" class="btn btn-secondary" id="clearFilters">Clear</button>
                        <button type="button" class="btn btn-primary" id="applySearch">Search</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="webmap/js/qgis2web_expressions.js"></script>
    <script src="webmap/js/leaflet.js"></script>
    <script src="webmap/js/L.Control.Locate.min.js"></script>
    <script src="webmap/js/leaflet.rotatedMarker.js"></script>
    <script src="webmap/js/leaflet.pattern.js"></script>
    <script src="webmap/js/leaflet-search.js"></script>
    <script src="webmap/js/leaflet-hash.js"></script>
    <script src="webmap/js/Autolinker.min.js"></script>
    <script src="webmap/js/rbush.min.js"></script>
    <script src="webmap/js/labelgun.min.js"></script>
    <script src="webmap/js/labels.js"></script>
    <script src="webmap/js/leaflet-control-geocoder.Geocoder.js"></script>
    <script src="webmap/data/new_location_1.js"></script>
    <script src="webmap/data/new_roads_2.js"></script>
    <script src="assets/js/toggle-legend.js"></script>
    <script src="webmap/js/Leaflet.AnimatedSearchBox.js"></script>
    <script src="assets/js/advancedSearch.js"></script>

    <!-- Simple Legend State Management Script -->
    <script>
        // Self-contained legend state management that doesn't rely on other scripts

    </script>

    <!-- Bootstrap JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous">
    </script>
    <?php include(__DIR__ . '/assets/content/QGIS-Map.php'); ?>
</body>

</html>