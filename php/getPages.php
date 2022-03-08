<?php
       header('Content-Type: application/json');

       $aResult = array();
       $path = str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT']);
       $path .= "\\pages";

        //function to get a list of all the html pages
        function getFiles($path){
            $files = array();
            if (is_dir($path)) {
                if ($dh = opendir($path)) {
                    while (($file = readdir($dh)) !== false) {
                        $newPath = $path."\\".$file;
                        if($file != "." && $file != ".."){
                            if (is_dir($newPath)){
                                $temp = getFiles($newPath);
                                $files = array_merge($files, $temp);

                            }else{
                                array_push($files, pathinfo($newPath)['filename']);
                            }
                        }
                    }
                    closedir($dh);
                }
            }
            return $files;
        }

        $files = getFiles($path);

        

        $aResult['result'] = $files;



        echo json_encode($aResult);


?>