<?php

// BY MONTH PAPALA
    function getAllPaidHoursOfTheFirstCutOff($pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) <= 15
--   AND MONTH(check_in_time) = MONTH(CURDATE())
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getPaidHoursOfTheFirstCutOff($id, $pdo) {
        $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id
  AND check_out_time IS NOT NULL
  AND DAY(check_in_time) <= 15
--   AND MONTH(check_in_time) = MONTH(CURDATE())
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursOfTheSecondCutOff($pdo) {

        $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
--   AND MONTH(check_in_time) = MONTH(CURDATE())
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

        function getPaidHoursOfTheSecondCutOff($id, $pdo) {
        $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id
  AND check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
--   AND MONTH(check_in_time) = MONTH(CURDATE())
--   AND YEAR(check_in_time) = YEAR(CURDATE());

";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }




    function getAllPaidHoursOfTheFirstCutOffByYear($year, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
AND DAY(check_in_time) <= 15
AND MONTH(check_in_time) = MONTH(CURDATE())
AND YEAR(check_in_time) = :year;

";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursOfTheSecondCutOffByYear($year, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
AND DAY(check_in_time) > 15
AND MONTH(check_in_time) = MONTH(CURDATE())
AND YEAR(check_in_time) = :year
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



    function getAllPaidHoursOfTheFirstCutOffByYearAndId($id, $year, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE
employee_id = :employee_id 
AND check_out_time IS NOT NULL
AND DAY(check_in_time) <= 15
-- AND MONTH(check_in_time) = MONTH(CURDATE())
AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":year" => $year
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getAllPaidHoursOfTheSecondCutOffByYearAndId($id, $year, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE
employee_id = :employee_id 
AND check_out_time IS NOT NULL
AND DAY(check_in_time) > 15
-- AND MONTH(check_in_time) = MONTH(CURDATE())
AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":year" => $year
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursOfTheFirstCutOffByYearMonthId($id, $year, $month, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE
employee_id = :employee_id 
AND check_out_time IS NOT NULL
AND DAY(check_in_time) <= 15
AND MONTH(check_in_time) = :month
AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":year" => $year,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



    function getAllPaidHoursOfTheSecondCutOffByYearMonthId($id, $year, $month, $pdo) {
    
        $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE
employee_id = :employee_id 
AND check_out_time IS NOT NULL
AND DAY(check_in_time) > 15
AND MONTH(check_in_time) = :month
AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":year" => $year,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getAllPaidHoursOfTheFirstCutOffByMonth($month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) <= 15
  AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursOfTheSecondCutOffByMonth($month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
  AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



    function getAllPaidHoursOfTheFirstCutOffByMonthId($id, $month, $pdo) {
    
    $query = "SELECT 
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE 
WHEN TIME(check_in_time) <= '09:15:00' 
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR, 
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id
AND check_out_time IS NOT NULL
AND DAY(check_in_time) <= 15
AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


     function getAllPaidHoursOfTheSecondCutOffByMonthId($id, $month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id
  AND check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
  AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



     function getAllYearPaidHoursOfTheFirstCutOffByMonth($month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) <= 15
  AND MONTH(check_in_time) = :month
  AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }




    function getAllPaidHoursByMonth($month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    
    function getAllPaidHoursByFirstPeriodYearMonth($year, $month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) <= 15
  AND MONTH(check_in_time) = :month
  AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursBySecondPeriodYearMonth($year, $month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
  AND MONTH(check_in_time) = :month
  AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year,
                ":month" => $month
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


     function getAllPaidHoursByFirstPeriodYear($year, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
  AND DAY(check_in_time) > 15
  AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year,
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getAllPaidHoursByIdMonth($id, $month, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id 
  AND check_out_time IS NOT NULL
  AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = YEAR(CURDATE());
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":month" => $month,
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



    function getAllPaidHoursByYearMonth($year, $month, $pdo) {
    
    $query = "SELECT
attendance_id,
employee_id,
check_in_time,
check_out_time,
TIMESTAMPDIFF(
HOUR,
CASE
WHEN TIME(check_in_time) <= '09:15:00'
THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
ELSE DATE_FORMAT(
check_in_time + INTERVAL 1 HOUR,
'%Y-%m-%d %H:00:00'
)
END,
LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
AND MONTH(check_in_time) = :month
AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year,
                ":month" => $month,
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }


    function getPaidHoursByIdYear($id, $year, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id 
  AND check_out_time IS NOT NULL
  AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":year" => $year,
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



     function getAllPaidHoursByYear($year, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE check_out_time IS NOT NULL
--   AND MONTH(check_in_time) = :month
  AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":year" => $year
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getAllPaidHoursById($id, $pdo) {
    
    $query = "SELECT 
    attendance_id,
    employee_id,
    check_in_time,
    check_out_time,
    TIMESTAMPDIFF(
        HOUR,
        CASE 
            WHEN TIME(check_in_time) <= '09:15:00' 
                THEN DATE_FORMAT(check_in_time, '%Y-%m-%d 09:00:00')
            ELSE DATE_FORMAT(
                check_in_time + INTERVAL 1 HOUR, 
                '%Y-%m-%d %H:00:00'
            )
        END,
        LEAST(check_out_time, DATE_FORMAT(check_out_time, '%Y-%m-%d 17:00:00'))
    ) AS paid_hours
FROM time_and_attendance
WHERE employee_id = :employee_id 
     AND check_out_time IS NOT NULL
--   AND MONTH(check_in_time) = :month
--   AND YEAR(check_in_time) = :year;
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

?>

