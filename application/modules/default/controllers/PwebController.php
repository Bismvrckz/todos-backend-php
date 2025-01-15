<?php

class Default_PwebController extends Zend_Controller_Action
{
    public function taskAction()
    {
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout->disableLayout();

        $request = $this->getRequest();
        $rawBody = $request->getRawBody();
        $jsonBody = json_decode($rawBody, true);


        $task_id = $jsonBody['task_id'] ?? null;
        $task_name = $jsonBody['task_name'] ?? null;
        $task_description = $jsonBody['task_description'] ?? null;
        $task_status = $jsonBody['task_status'] ?? null;

        if ($request->isGet()) {
            $response = Default_Model_Apps::GetTasks();
            $this->_helper->json($response);
        }

        if ($request->isPost()) {
            Default_Model_Apps::CreateTask($task_name, $task_description, $task_status);

            $response = array(
                "status" => "success",
            );

            $this->_helper->json($response);
        }

        if ($request->isPut()) {
            Default_Model_Apps::UpdateTask($task_id, $task_name, $task_description, $task_status);

            $response = array(
                "status" => "success",
            );

            $this->_helper->json($response);
        }

        if ($request->isDelete()) {
            Default_Model_Apps::DeleteTask($task_id);

            $response = array(
                "status" => "success",
            );

            $this->_helper->json($response);
        }
    }
}
