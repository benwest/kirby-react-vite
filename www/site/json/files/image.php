<?php

use Kirby\Cms\File;

return function (File $file) {
  return [
    "type" => "image",
    "srcSet" => $file->srcset('default'),
    "ratio" => $file->ratio(),
  ];
};