<?php

use Kirby\Cms\File;

return function (File $file) {
  return [
    "type" => "image",
    "srcset" => $file->srcset('default'),
    "ratio" => $file->ratio(),
  ];
};