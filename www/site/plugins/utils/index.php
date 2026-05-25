<?php

use Kirby\Cms\App;
use Kirby\Content\Field;
use Kirby\Toolkit\Str;

App::plugin('bewe/utils', [
  'fieldMethods' => [
    'to' => function (Field $field, Closure $callback) {
      return $callback($field->value());
    },
    'pipe' => function (Field $field, Closure $callback) {
      return $field->value($callback($field->value()));
    },
    'with' => function (Field $field, Closure $callback) {
      return $callback($field->clone());
    },
    'toPath' => function (Field $field) {
      $url = $field->toUrl();
      if ($url === null)
        return null;
      $siteUrl = site()->url();
      if ($url === $siteUrl)
        return '/';
      return Str::replace($url, $siteUrl, '');
    },
  ],
  'pageMethods' => [
    'to' => function (Closure $callback) {
      return $callback($this);
    },
  ],
  'siteMethods' => [
    'to' => function (Closure $callback) {
      return $callback($this);
    },
  ],
  'collectionMethods' => [
    'to' => function (Closure $callback) {
      return $callback($this);
    },
  ],
]);
