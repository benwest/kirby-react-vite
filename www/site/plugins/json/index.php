<?php

use Kirby\Cms\App;
use Kirby\Content\Field;
use Kirby\Filesystem\F;
use Kirby\Http\Response;
use Kirby\Toolkit\Str;

App::plugin('bewe/json', [
  'options' => [
    'root' => kirby()->root('site') . '/json',
  ],
  'siteMethods' => [
    'loadJson' => function (string $path, ...$args) {
      $root = option('bewe.json.root');
      $path = "$root/$path.php";
      if (!F::exists($path))
        return null;
      try {
        return F::load($path)(...$args);
      } catch (Exception $e) {
        return [
          'error' => $e->getMessage(),
          'file' => $e->getFile(),
          'line' => $e->getLine(),
        ];
      }
    },
    'json' => function () {
      return $this->loadJson('site', $this);
    },
  ],
  'pageMethods' => [
    'jsonUrl' => function () {
      if ($this->isHomePage()) {
        return $this->url() . '/home.json';
      }
      return $this->url() . '.json';
    },
    'json' => function (string $type = null) {
      $site = site();
      return $site->loadJson('pages/' . $this->intendedTemplate()->name(), $this)
        ?? $site->loadJson('pages/default', $this);
    },
  ],
  'pagesMethods' => [
    'json' => function () {
      return $this->map(fn($page) => $page->json())->values();
    },
  ],
  'fileMethods' => [
    'json' => function () {
      $site = site();
      return $site->loadJson('files/' . $this->intendedTemplate()->name(), $this)
        ?? $site->loadJson('files/' . $this->type(), $this)
        ?? $site->loadJson('files/default', $this);
    },
  ],
  'filesMethods' => [
    'json' => function () {
      return $this->map(fn($file) => $file->json())->values();
    },
  ],
  'fieldMethods' => [
    'toFileJson' => function (Field $field) {
      if ($file = $field->toFile())
        return $file->json();
      return null;
    },
  ],
  'blockMethods' => [
    'json' => function () {
      $site = site();
      return $site->loadJson('blocks/' . $this->type(), $this)
        ?? $site->loadJson('blocks/default', $this);
    },
  ],
  'blocksMethods' => [
    'json' => function () {
      return $this->map(fn($block) => $block->json())->values();
    },
  ],
  'userMethods' => [
    'json' => function () {
      $site = site();
      return $site->loadJson('users/' . $this->role()->name(), $this)
        ?? $site->loadJson('users/default', $this);
    },
  ],
  'usersMethods' => [
    'json' => function () {
      return $this->map(fn($user) => $user->json())->values();
    },
  ],
  'routes' => [
    [
      'pattern' => '(:all).json',
      'language' => '*',
      'action' => function (...$args) {
        $kirby = kirby();
        $multilang = $kirby->multilang();

        $language = $multilang ? $args[0] : null;
        $path = $multilang ? $args[1] : $args[0];

        if ($language) {
          $kirby->setCurrentLanguage($language);
        }

        $path = Str::rtrim($path, '.json');

        if ($path === 'site') {
          return Response::json(site()->json());
        }

        $page = kirby()->resolve($path, $language) ?? site()->errorPage();

        if ($page) {
          site()->visit($page, $language?->code());
          $json = $page->json();
          return Response::json($json);
        }

        return null;
      }
    ],
  ],
]);
