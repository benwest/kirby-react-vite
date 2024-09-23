<?php

use Kirby\Cms\App;
use Kirby\Filesystem\F;
use Kirby\Filesystem\Dir;
use Kirby\Http\Response;

class Json {

  static $types = [];

  static function extend(array $types) {
    foreach ($types as $type => $view) {
      self::$types[$type] = array_merge(self::$types[$type] ?? [], $view);
    }
  }

  static function loadDir(string $dir) {
    $types = [];
    foreach (Dir::dirs($dir) as $type) {
      $views = [];
      foreach (Dir::files($dir . '/' . $type) as $view) {
        $views[F::name($view)] = F::load("$dir/$type/$view");
      }
      $types[$type] = $views;
    }
    self::extend($types);
  }

  static function has(string $type, string $view) {
    return isset(self::$types[$type]) && isset(self::$types[$type][$view]);
  }

  static function get(string $type, string $view, ...$args) {
    if (!self::has($type, $view)) return null;
    return self::$types[$type][$view](...$args);
  }
  
  static function match(string $type, array $views, ...$args) {
    foreach ($views as $view) {
      if (!$view) continue;
      if (!self::has($type, $view)) continue;
      return self::get($type, $view, ...$args);
    }
    return null;
  }
}

Json::loadDir(kirby()->root('site') . '/json');

App::plugin('bewe/json', [
  'siteMethods' => [
    'json' => function (string $view = null) {
      return Json::match('site', [$view, 'default'], $this);
    },
  ],
  'pageMethods' => [
    'jsonUrl' => function () {
      if ($this->isHomePage()) {
        return $this->url() . '/home.json';
      }
      return $this->url() . '.json';
    },
    'json' => function (string $view = null) {
      return Json::match("pages", [$view, $this->intendedTemplate()->name(), 'default'], $this);
    },
  ],
  "pagesMethods" => [
    'json' => function (string $view = null) {
      return $this->map(function ($page) use ($view) {
        return $page->json($view);
      })->values();
    },
  ],
  'fileMethods' => [
    'json' => function (string $view = null) {
      return Json::match("files", [$view, $this->template(), $this->type(), 'default'], $this);
    },
  ],
  "filesMethods" => [
    'json' => function (string $view = null) {
      return $this->map(function ($file) use ($view) {
        return $file->json($view);
      })->values();
    },
  ],
  "blockMethods" => [
    'json' => function (string $view = null) {
      return Json::match("blocks", [$view, $this->type(), 'default'], $this);
    },
  ],
  "blocksMethods" => [
    'json' => function (string $view = null) {
      return $this->map(function ($block) use ($view) {
        return $block->json($view);
      })->values();
    },
  ],
  "userMethods" => [
    'json' => function (string $view = null) {
      return Json::match("users", [$view, $this->role()->name(), 'default'], $this);
    },
  ],
  "usersMethods" => [
    'json' => function (string $view = null) {
      return $this->map(function ($user) use ($view) {
        return $user->json($view);
      })->values();
    },
  ],
  'routes' => [
    [
      "pattern" => "(:all).json",
      "action" => function ($path) {
        $page = page($path);
        $json = $page ? $page->json() : site()->errorPage()->json();
        return new Response(json_encode($json), 'application/json');
      }
    ],
  ],
]);