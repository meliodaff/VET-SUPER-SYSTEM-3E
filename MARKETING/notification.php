<?php


function setTempData($key, $value) {
    $_SESSION['tempdata'][$key] = $value;
}


function getTempData($key) {
    if (isset($_SESSION['tempdata'][$key])) {
        $value = $_SESSION['tempdata'][$key];
        unset($_SESSION['tempdata'][$key]); // remove after reading
        return $value;
    }
    return null;
}
