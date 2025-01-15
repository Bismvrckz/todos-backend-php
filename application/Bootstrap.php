<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initLogger()
    {
        Zend_Session::start();
        $date = date('d-M-Y');

        $activityLogs = "../application/act_logs";
        $logfile_format = $date . ".log";

        if (!is_dir($activityLogs)) {
            mkdir($activityLogs, 0777, true);
        }

        if (!file_exists($activityLogs . "/" . $logfile_format)) {
            $handlekegiatan = fopen($activityLogs . "/" . $logfile_format, 'w') or die('Cannot open file:  ' . $logfile_format);
            chmod($activityLogs . "/" . $logfile_format, 0777);
        }

        $log_Writer_Stream = new Zend_Log_Writer_Stream($activityLogs . "/" . $logfile_format);
        $log_format = '%timestamp% %priorityName%: %message%' . PHP_EOL;
        $zend_Log_Formatter = new Zend_Log_Formatter_Simple($log_format);
        $log_Writer_Stream->setFormatter($zend_Log_Formatter);
        $zend_Log = new Zend_Log($log_Writer_Stream);
        $zend_Log->setTimestampFormat("d-M-Y H:i:s");

        // $zend_Log->info("Logger initialized successfully.");

        Zend_Registry::set('logger', $zend_Log);
    }
}


