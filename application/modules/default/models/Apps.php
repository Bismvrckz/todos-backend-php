<?php

class Default_Model_Apps
{
    public static function InitDb()
    {
        $options = array(
            Zend_Db::ALLOW_SERIALIZATION => false
        );

        $params = array(
            'host' => '127.0.0.1',
            'username' => 'tkbai',
            'port' => '3307',
            'password' => '03IZmt7eRMukIHdoZahl',
            'dbname' => 'todos',
            'options' => $options
        );

        $db = Zend_Db::factory('Pdo_Mysql', $params);
        return $db;
    }

    public static function GetTasks()
    {
        $db = Default_Model_Apps::InitDb();
        $sql = "SELECT * FROM todos.task";

        return $db->fetchAll($sql);
    }

    public static function CreateTask($task_name, $task_description, $task_status)
    {
        $db = Default_Model_Apps::InitDb();
        $sql = "INSERT INTO todos.task (task_name,task_description, task_status) 
                VALUES ('" . $task_name . "','" . $task_description . "','" . $task_status . "')";

        return $db->query($sql);
    }


    public static function UpdateTask($task_id, $task_name, $task_description, $task_status)
    {
        $db = Default_Model_Apps::InitDb();
        $sql = "UPDATE todos.task SET 
                      task_name = '" . $task_name . "', 
                      task_description = '" . $task_description . "', 
                      task_status = '" . $task_status . "' 
                      WHERE task_id = '" . $task_id . "'";

        return $db->query($sql);
    }


    public static function DeleteTask($task_id)
    {
        $db = Default_Model_Apps::InitDb();
        $sql = "DELETE FROM todos.task WHERE task_id = '" . $task_id . "'";

        return $db->query($sql);
    }
}

?>