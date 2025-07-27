<?php $result = mysqli_query($mysqli, "SELECT tbl_deceased.*, grave_points.*, tbl_files.record_id AS file_record_id FROM tbl_deceased
            RIGHT JOIN grave_points ON tbl_deceased.grave_id=grave_points.grave_id
            LEFT JOIN tbl_files ON tbl_files.record_id=tbl_deceased.record_id"); ?>
<script>
    var json_category_5 = {
        "type": "FeatureCollection",
        "name": "category_5",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": [
            <?php
            while ($row = mysqli_fetch_array($result)) {
            ?> {
                    "type": "Feature",
                    "properties": {
                        "Grave No.": "<?php echo $row['grave_id'] ?>",
                        "Visibility": "<?php echo $row['dead_visibility'] ?>",
                        "id": "<?php echo $row['record_id'] ?>",
                        "category": "<?php echo $row['category'] ?>",
                        "Name": "<?php
                                    $graveno = $row['grave_id'];
                                    $sql = "SELECT * FROM tbl_deceased WHERE grave_id = $graveno";
                                    if ($records = mysqli_query($mysqli, $sql)) {
                                        $counter4deceased = 1;
                                        while ($record = mysqli_fetch_assoc($records)) {
                                            echo $record['dead_fullname'];
                                            $counter4deceased++;
                                        }
                                    }
                                    ?>",
                        "Contact Person": "<?php
                                            $graveno = $row['grave_id'];
                                            $sql = "SELECT c.first_name, c.last_name, l.grave_id FROM tbl_lot l JOIN tbl_customers c ON c.customer_id = l.customer_id WHERE l.grave_id = $graveno";
                                            if ($records = mysqli_query($mysqli, $sql)) {
                                                $counter4deceased = 1;
                                                while ($record = mysqli_fetch_assoc($records)) {
                                                    echo $record['first_name'] . ' ' . $record['last_name'];
                                                    $counter4deceased++;
                                                }
                                            }
                                            ?>",
                        "Multiple Names": "<?php
                                            $graveno = $row['grave_id'];
                                            $sql = "SELECT dead_fullname, dead_birth_date, dead_date_death FROM tbl_deceased WHERE grave_id = $graveno";
                                            $output = '';
                                            if ($records = mysqli_query($mysqli, $sql)) {
                                                while ($record = mysqli_fetch_assoc($records)) {
                                                    $output .= '<div class=\"deceased-record\">';
                                                    $output .= '<strong>' . addslashes($record['dead_fullname']) . '</strong><br>';
                                                    $output .= '<small>Birth: ' . addslashes($record['dead_birth_date'] ?: 'N/A') . '</small><br>';
                                                    $output .= '<small>Death: ' . addslashes($record['dead_date_death'] ?: 'N/A') . '</small>';
                                                    $output .= '</div>';
                                                }
                                            }
                                            echo $output;
                                            ?>",
                        "DeceasedCount": "<?php echo $counter4deceased - 1; ?>",
                        "Birth": "<?php
                                    if ($duplicate = mysqli_query($mysqli, $sql)) {
                                        while ($dup = mysqli_fetch_assoc($duplicate)) {
                                            if (!empty($dup['dead_birth_date'])) {
                                                $date = new DateTime($dup['dead_birth_date']);
                                                echo $date->format('m/d/Y');
                                            } else {
                                                echo 'N/A';
                                            }
                                        }
                                    }
                                    ?>",
                        "Death": "<?php
                                    if ($duplicate = mysqli_query($mysqli, $sql)) {
                                        while ($dup = mysqli_fetch_assoc($duplicate)) {
                                            if (!empty($dup['dead_date_death'])) {
                                                $date = new DateTime($dup['dead_date_death']);
                                                echo $date->format('m/d/Y');
                                            } else {
                                                echo 'N/A';
                                            }
                                        }
                                    }
                                    ?>",
                        "Years Buried": "<?php
                                            if ($duplicate = mysqli_query($mysqli, $sql)) {
                                                while ($dup = mysqli_fetch_assoc($duplicate)) {
                                                    $current_date = new DateTime();
                                                    $death_date = new DateTime($dup['dead_date_death']);
                                                    $interval = $current_date->diff($death_date);
                                                    $years_buried = $interval->y;
                                                    $months_buried = $interval->m;

                                                    if ($years_buried < 1 && $months_buried < 12) {
                                                        echo 'Less than a year' . "<br>";
                                                    } else {
                                                        echo $years_buried . ' year(s) ' . $months_buried . ' months' . "<br>";
                                                    }
                                                }
                                            }
                                            ?>",
                        "Block": "<?php echo $row['block']; ?>",
                        "Status": "<?php echo $row['status']; ?>",
                        "Photos": "<?php
                                    $counter = 0;
                                    $sql = "SELECT * FROM tbl_files WHERE record_id = $graveno";
                                    if ($duplicate = mysqli_query($mysqli, $sql)) {
                                        while ($dup = mysqli_fetch_assoc($duplicate)) {
                                            $image_url = htmlspecialchars($dup['grave_filename'], ENT_QUOTES);
                                            echo "<a href='$image_url' target='_blank'><img src='$image_url' class='grave-photo' alt='Grave photo' class='grave-photo' alt='Grave photo'></a>";
                                            $counter++;
                                        }
                                    }
                                    ?>",
                        "public_photos": "<?php
                                    $counter = 0;
                                    $sql = "SELECT * FROM tbl_files WHERE location_id = 1";
                                    if ($duplicate = mysqli_query($mysqli, $sql)) {
                                        while ($dup = mysqli_fetch_assoc($duplicate)) {
                                            $filename_url = htmlspecialchars($dup['file_name'], ENT_QUOTES);
                                        }
                                    }
                                    ?>",
                        "PhotoCount": "<?php echo $counter; ?>",
                        "auxiliary_storage_labeling_offsetquad": "<?php echo $row['label']; ?>"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [<?php $trim = str_replace('""', '', $row['coordinates']);
                                        echo $trim; ?>]
                    }
                },
            <?php
            }
            ?>
        ]
    }
</script>