<?php
       header('Content-Type: application/json');

       $aResult = array();

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



        //function to get the content for the news article with the given id
        function getArticleContent($id){
            //talk to database to get the content for the article with given id
            $contents = getNewsContent();
            foreach($contents as $content){
                if($content["id"] == $id){
                    return $content;
                }
            }
        }

        //function to return all the news content
        function getNewsContent(){
            $path = str_replace('/', '\\', $_SERVER['DOCUMENT_ROOT']);
            $root = $path;
            $path .= "\\pages\\news\\articleContent";
            $articles = getFiles($path);
            return $articles;
        }
        


        $aResult = array();
        switch($_POST['function']){
            case "getResults":
                $aResult['result'] = getResults($_POST['request']);
                break;
            case "getArticleContent":
                $aResult['result'] = getArticleContent($_POST['request']);
        }

        echo json_encode($aResult);


?>