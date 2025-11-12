<?php
    function validateForm($form){
        
        foreach($form as $field){
        if(!isset($_POST[$field]) || trim($_POST[$field]) === ""){
            http_response_code(422);
            echo json_encode([
                "error" => "Incomplete information",
                "message" => "The $field is missing"
            ]);
            exit();
        }
    }   
    }
?>