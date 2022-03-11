<?php
       header('Content-Type: application/json');

       $aResult = array();
    //    $path = str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT']);
    //    $root = $path;
    //    $path .= "\\pages";

    //     //function to get a list of all the html pages
    //     function getFiles($path, $root){
    //         $files = array();
    //         if (is_dir($path)) {
    //             if ($dh = opendir($path)) {
    //                 while (($file = readdir($dh)) !== false) {
    //                     $newPath = $path."\\".$file;
    //                     if($file != "." && $file != ".."){
    //                         if (is_dir($newPath)){
    //                             $temp = getFiles($newPath, $root);
    //                             $files = array_merge($files, $temp);

    //                         }else{
    //                             $data = array();
    //                             $data['fileName'] = pathinfo($newPath)['filename'];
    //                             $data['path'] = str_replace("//", "/", str_replace("\\", "/", str_replace($root, "/", $newPath)));
    //                             array_push($files, $data);
    //                         }
    //                     }
    //                 }
    //                 closedir($dh);
    //             }
    //         }
    //         return $files;
    //     }

        // $files = getFiles($path, $root);
        // $aResult['result'] = $files;
        // echo json_encode($aResult);

        //function to take a request query and return a list of matching results
        function getResults($request){
            $newsArticles = getNews();
            $searchResults = array();
            foreach($newsArticles as $article){
                if(strpos($article["title"], $request) !== false){
                    array_push($searchResults, $article);
                }
            }
            return $searchResults;
        }

        //function to get the news articles
        function getNews(){
            $path = str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT']);
            $root = $path;
            $path .= "\\pages\\news\\articles";
            $articles = getFiles($path);
            return $articles;
        }

        //recursive function to get and parse json files
        function getFiles($path){
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
                                $data = parseJson($newPath);
                                array_push($files, $data);
                            }
                        }
                    }
                    closedir($dh);
                }
            }
            return $files;
        }

        //function to parse a json file into a php object
        function parseJson($file){
            $jsonFileContents = file_get_contents($file);
            return json_decode($jsonFileContents, true);
        }
        


        $aResult = array();
        $aResult['result'] = getResults();
        echo json_encode($aResult);


?>