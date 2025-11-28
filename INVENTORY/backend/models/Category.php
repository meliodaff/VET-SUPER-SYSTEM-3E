<?php
class Category
{
    private $conn;
    private $table_name = "categories";

    public $id;
    public $name;
    public $description;
    public $product_count;
    public $created_date;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // READ all categories
    public function read()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // READ single category
    public function readOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->product_count = $row['product_count'];
            $this->created_date = $row['created_date'];
            return true;
        }
        return false;
    }

    // CREATE category
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, 
                      description=:description, 
                      created_date=:created_date";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->created_date = date('Y-m-d H:i:s');

        // Bind
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":created_date", $this->created_date);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // UPDATE category
    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET name=:name, 
                      description=:description
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE category
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
