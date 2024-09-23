<?php

use Kirby\Cms\Site;

return function (Site $site) {
  return [
    "title" => $site->title()->value(),
    "url" => $site->url(),
  ];
};