<?php

use Kirby\Cms\Block;

return function (Block $block) {
  return [
    "type" => $block->type(),
    "content" => $block->content()->toArray(),
  ];
};