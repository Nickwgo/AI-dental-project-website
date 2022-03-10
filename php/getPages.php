<?php
       header('Content-Type: application/json');

       $aResult = array();
       $path = str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT']);
       $root = $path;
       $path .= "\\pages";

        //function to get a list of all the html pages
        function getFiles($path, $root){
            $files = array();
            if (is_dir($path)) {
                if ($dh = opendir($path)) {
                    while (($file = readdir($dh)) !== false) {
                        $newPath = $path."\\".$file;
                        if($file != "." && $file != ".."){
                            if (is_dir($newPath)){
                                $temp = getFiles($newPath, $root);
                                $files = array_merge($files, $temp);

                            }else{
                                $data = array();
                                $data['fileName'] = pathinfo($newPath)['filename'];
                                $data['path'] = str_replace("//", "/", str_replace("\\", "/", str_replace($root, "/", $newPath)));
                                array_push($files, $data);
                            }
                        }
                    }
                    closedir($dh);
                }
            }
            return $files;
        }

        $files = getFiles($path, $root);

        

        $aResult['result'] = $files;



        echo json_encode($aResult);


?>