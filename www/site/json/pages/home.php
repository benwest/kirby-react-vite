<?php

use Kirby\Cms\Page;

return function (Page $page) {
  return [
    "type" => "home",
    "title" => $page->title()->value(),
    "files" => $page->files()->json(),
    "num" => $page->content()->num()->toFloat(),
    "blocks" => $page->blocks()->toBlocks()->json(),
  ];
};