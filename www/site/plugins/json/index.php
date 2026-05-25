<?php

use Kirby\Cms\App;
use Kirby\Content\Field;
use Kirby\Filesystem\F;
use Kirby\Http\Response;
use Kirby\Toolkit\Str;

function loadJson(string $path, mixed ...$args): mixed
{
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
}

function resolveJson(string $prefix, array $candidates, mixed ...$args): mixed
{
  foreach (array_filter($candidates) as $candidate) {
    $result = loadJson("$prefix/$candidate", ...$args);
    if ($result !== null) return $result;
  }
  return null;
}

App::plugin('bewe/json', [
  'options' => [
    'root' => kirby()->root('site') . '/json',
  ],
  'siteMethods' => [
    'json' => function () {
      return loadJson('site', $this);
    },
  ],
  'pageMethods' => [
    'jsonUrl' => function () {
      if ($this->isHomePage()) {
        return $this->url() . '/home.json';
      }
      return $this->url() . '.json';
    },
    'json' => function (?string $type = null) {
      return resolveJson('pages', [$type, $this->intendedTemplate()->name(), 'default'], $this);
    },
  ],
  'pagesMethods' => [
    'json' => function (?string $type = null) {
      return $this->map(fn($page) => $page->json($type))->values();
    },
  ],
  'fileMethods' => [
    'json' => function (?string $type = null) {
      return resolveJson('files', [$type, $this->intendedTemplate()->name(), $this->type(), 'default'], $this);
    },
  ],
  'filesMethods' => [
    'json' => function (?string $type = null) {
      return $this->map(fn($file) => $file->json($type))->values();
    },
  ],
  'fieldMethods' => [
    'toFileJson' => function (Field $field, ?string $type = null) {
      if ($file = $field->toFile())
        return $file->json($type);
      return null;
    },
  ],
  'blockMethods' => [
    'json' => function (?string $type = null) {
      return resolveJson('blocks', [$type, $this->type(), 'default'], $this);
    },
  ],
  'blocksMethods' => [
    'json' => function (?string $type = null) {
      return $this->map(fn($block) => $block->json($type))->values();
    },
  ],
  'userMethods' => [
    'json' => function (?string $type = null) {
      return resolveJson('users', [$type, $this->role()->name(), 'default'], $this);
    },
  ],
  'usersMethods' => [
    'json' => function (?string $type = null) {
      return $this->map(fn($user) => $user->json($type))->values();
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
