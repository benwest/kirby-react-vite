<?php

use Kirby\Cms\Page;

return function (Page $page) {
  return [
    "type" => "error",
    "title" => $page->title()->value(),
    "url" => $page->url(),
  ];
};