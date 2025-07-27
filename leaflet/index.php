<?php 
include_once '../include/config.php';
include_once '../include/database.php'; 
    $total_plots = mysqli_fetch_assoc(mysqli_query($mysqli, "SELECT COUNT(grave_id) as total_plots FROM grave_points"));
    $available_plots = mysqli_fetch_assoc(mysqli_query($mysqli, "SELECT COUNT(status) as status FROM grave_points WHERE status = 'vacant'"));
    $reserved_plots = mysqli_fetch_assoc(mysqli_query($mysqli, "SELECT COUNT(status) as status FROM grave_points WHERE status = 'reserved'"));
    $occupied_plots = mysqli_fetch_assoc(mysqli_query($mysqli, "SELECT COUNT(status) as status FROM grave_points WHERE status = 'occupied1' OR status = 'occupied2'"));

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

    <!-- Custom CSS -->
    <link rel="stylesheet" crossorigin href="../assets/compiled/css/app.css">
    <link rel="shortcut icon" href="../assets/images/system-icon.svg" type="image/x-icon" />
    <link rel="stylesheet" href="css/map-filter.css">
    <link rel="stylesheet" href="css/popup-modal.css">
    <link rel="stylesheet" href="css/map-overview.css">
    <link rel="stylesheet" href="css/leaflet-searchbar.css">
    <link rel="stylesheet" href="css/floating-navbar.css">
    <link rel="stylesheet" href="css/Leaflet.AnimatedSearchBox.css">

    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="css/leaflet.css">
    <link rel="stylesheet" href="css/L.Control.Layers.Tree.css">
    <link rel="stylesheet" href="css/L.Control.Locate.min.css">
    <link rel="stylesheet" href="css/qgis2web.css">
    <link rel="stylesheet" href="css/fontawesome-all.min.css">
    <link rel="stylesheet" href="css/leaflet.photon.css">
    <link rel="stylesheet" href="css/leaflet-measure.css">
    <link rel="stylesheet" href="css/cemetery-navigation-panel.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <title>Finisterre - Map</title>
    <script async data-id="five-server" src="http://localhost:5500/fiveserver.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://kit.fontawesome.com/665d03e83d.js" crossorigin="anonymous"></script>
    <style>
    #map {
        width: 100%;
        height: 100vh;
    }
    </style>
</head>

<body>
    <main>
        <!-- Display finisterre map here -->
        <div id="map">
            <div class="searchbar-container d-flex gap-3 justify-content-center align-items-center">
                <div class="searchbar" id="search-container"></div>
                <div class="button-wrapper">
                    <a href="#" class="advanced-search-icon" data-bs-toggle="modal"
                        data-bs-target="#advancedSearchModal" title="Advanced Search" aria-label="Advanced Search"
                        data-bs-placement="bottom">
                        <i class="bi bi-sliders"></i>
                    </a>
                </div>
                <div class="button-wrapper">
                    <button class="advanced-search-icon" onclick="filterMap()" data-bs-toggle="modal"
                        data-bs-target="#mapFilterModal">
                        <i class="bi bi-funnel"></i>
                    </button>
                </div>
                <div class="button-wrapper">
                    <button class="advanced-search-icon" onclick="centerMap()">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
                <div class="button-wrapper">
                    <button class="advanced-search-icon" onclick="whereAmI()">
                        <i class="bi bi-person-arms-up"></i>
                    </button>
                </div>
                <div class="button-wrapper">
                    <button class="advanced-search-icon" onclick="showLayers()">
                        <i class="bi bi-stack"></i>
                    </button>
                </div>
                <div class="button-wrapper">
                    <a href="../index.html" class="advanced-search-icon">
                        <i class="bi bi-house-door"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- Advanced Search Modal -->
        <div class="modal fade" id="advancedSearchModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-search me-2"></i>Advanced Search</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body h-100">
                        <div class="alert alert-info mb-3" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Advanced Search:</strong> Please fill at least 3 fields for more accurate and
                            specific
                            search results.
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Deceased Name</label>
                            <div class="form-group position-relative has-icon-left">
                                <input type="text" class="form-control" placeholder="Enter full name or partial name"
                                    aria-label="Username" aria-describedby="deceased-name" id="nameSearch">
                                <div class="form-control-icon">
                                    <i class="bi bi-person"></i>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Block</label>
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
                                    <label class="form-label">Grave ID</label>
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
                            <label class="form-label">Gender</label>
                            <select class="form-select" id="genderFilter">
                                <option hidden value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Birth Date</label>
                            <div class="input-group">
                                <input type="date" class="form-control" placeholder="From year" id="birthYearFrom"
                                    min="1800" max="2024">
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

        <!-- Map Filter Modal -->
        <div class="modal fade" id="mapFilterModal" tabindex="-1" aria-labelledby="mapFilterModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-funnel-fill me-2"></i>Cemetery Map Filters</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row">
                            <!-- Status Filter Section -->
                            <div class="col-md-6 mb-4">
                                <div class="filter-section">
                                    <h6 class="filter-section-title">
                                        <i class="bi bi-circle-fill me-2"></i>
                                        Filter by Status
                                    </h6>
                                    <p class="text-muted small mb-3">Select grave statuses to display on the map</p>
                                    <div class="status-filter-grid">
                                        <div class="status-option" data-status="vacant">
                                            <div class="status-checkbox">
                                                <input type="checkbox" id="vacant" value="vacant" checked>
                                                <label for="vacant" class="status-label">
                                                    <span class="status-color vacant-color"></span>
                                                    <span class="status-text">
                                                        <strong>Vacant</strong>
                                                        <small
                                                            class="d-block text-muted"><?php echo $available_plots['status']; ?>
                                                            available</small>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="status-option" data-status="reserved">
                                            <div class="status-checkbox">
                                                <input type="checkbox" id="reserved" value="reserved" checked>
                                                <label for="reserved" class="status-label">
                                                    <span class="status-color reserved-color"></span>
                                                    <span class="status-text">
                                                        <strong>Reserved</strong>
                                                        <small
                                                            class="d-block text-muted"><?php echo $reserved_plots['status']; ?>
                                                            reserved</small>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="status-option" data-status="occupied1">
                                            <div class="status-checkbox">
                                                <input type="checkbox" id="occupied" value="occupied1" checked>
                                                <label for="occupied" class="status-label">
                                                    <span class="status-color occupied-color"></span>
                                                    <span class="status-text">
                                                        <strong>Occupied</strong>
                                                        <small
                                                            class="d-block text-muted"><?php echo $occupied_plots['status']; ?>
                                                            occupied</small>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Block Filter Section -->
                            <div class="col-md-6 mb-4">
                                <div class="filter-section">
                                    <h6 class="filter-section-title">
                                        <i class="bi bi-grid-3x3-gap-fill me-2"></i>
                                        Filter by Block
                                    </h6>
                                    <p class="text-muted small mb-3">Select specific cemetery blocks to display</p>
                                    <div class="block-filter-container">
                                        <div class="block-select-all mb-2">
                                            <input type="checkbox" id="selectAllBlocks" checked>
                                            <label for="selectAllBlocks" class="form-label mb-0">
                                                <strong>All Blocks</strong>
                                            </label>
                                        </div>
                                        <div class="block-options-grid">
                                            <?php 
                                    // Reset the result pointer for blocks
                                    if ($blocks_result) {
                                        mysqli_data_seek($blocks_result, 0);
                                        while ($block = mysqli_fetch_assoc($blocks_result)): 
                                    ?>
                                            <div class="block-option">
                                                <input type="checkbox" id="block_<?php echo $block['block']; ?>"
                                                    value="<?php echo $block['block']; ?>" class="block-checkbox"
                                                    checked>
                                                <label for="block_<?php echo $block['block']; ?>" class="block-label">
                                                    Block <?php echo $block['block']; ?>
                                                </label>
                                            </div>
                                            <?php 
                                        endwhile; 
                                    }
                                    ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-flex justify-content-between w-100">
                            <div class="filter-stats">
                                <small class="text-muted">
                                    <span id="filterResultCount">Showing all <?php echo $total_plots['total_plots']; ?>
                                        graves</span>
                                </small>
                            </div>
                            <div class="filter-actions">
                                <button type="button" class="btn btn-outline-secondary btn-sm me-2" id="resetFilters">
                                    <i class="bi bi-arrow-counterclockwise me-1"></i>Reset All
                                </button>
                                <button type="button" class="btn btn-success btn-sm" id="applyFilters">
                                    <i class="bi bi-check-lg me-1"></i>Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="nav-panel" class="cemetery-nav-panel" style="display:none">
            <div class="cemetery-nav-header">
                <div class="cemetery-nav-title">
                    <i class="fas fa-route"></i>
                    <strong>Navigation Active</strong>
                </div>
                <button onclick="stopNavigation()" class="cemetery-nav-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cemetery-nav-stats">
                <div class="cemetery-nav-distance">
                    <i class="fas fa-road"></i>
                    <span id="cemetery-nav-distance-value">0.0 km</span>
                </div>
                <div class="cemetery-nav-duration">
                    <i class="fas fa-clock"></i>
                    <span id="cemetery-nav-duration-value">0 min</span>
                </div>
            </div>
        </div>
    </main>
    <script src="js/qgis2web_expressions.js"></script>
    <script src="js/leaflet.js"></script>
    <script src="js/L.Control.Layers.Tree.min.js"></script>
    <script src="js/L.Control.Locate.min.js"></script>
    <script src="js/leaflet-svg-shape-markers.min.js"></script>
    <script src="js/leaflet.rotatedMarker.js"></script>
    <script src="js/leaflet.pattern.js"></script>
    <script src="js/leaflet-hash.js"></script>
    <script src="js/Autolinker.min.js"></script>
    <script src="js/rbush.min.js"></script>
    <script src="js/labelgun.min.js"></script>
    <script src="js/labels.js"></script>
    <script src="js/leaflet.photon.js"></script>
    <script src="js/leaflet-measure.js"></script>
    <script src="data/Chapel_1.js"></script>
    <script src="data/parking_2.js"></script>
    <script src="data/Clusters_3.js"></script>
    <script src="data/category_5.js"></script>
    <script src="data/entrance_6.js"></script>
    <script src="data/exit_7.js"></script>
    <script src="data/playground_1.js"></script>

    <!-- Leaflet Map -->
    <script src="leaflet/popup-utils.js"></script>
    <script src="leaflet/map-navbar-functions.js"></script>
    <script src="js/advanced-search.js"></script>
    <!-- <script src="leaflet/get-directions.js"></script> -->
    <script src="leaflet/get-route.js"></script>
    <script src="leaflet/route-simulation.js"></script>

    <!-- <script src="js/toggle-legend.js"></script> -->
    <script src="js/map-filter.js"></script>
    <script src="js/Leaflet.AnimatedSearchBox.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>

    <script>
    lucide.createIcons();
    </script>

    <?php include __DIR__ . '/finisterre_map.php'; ?>

    <!-- Bootstrap JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous">
    </script>
</body>

</html>