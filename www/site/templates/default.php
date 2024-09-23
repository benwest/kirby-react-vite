<?php $title = $page->title() . ' | ' . $site->title() ?>
<?php $url = $page->url() ?>
<?php $description = $page->metaDescription() ?? $site->defaultMetaDescription() ?>
<?php $image = $page->metaImage() ?? $site->defaultMetaImage() ?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title><?= $title ?></title>

  <base href="<?= $page->url() ?>">
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta property="og:title" content="<?= $title ?>" />
  <meta name="twitter:title" content="<?= $title ?>" />
  <meta property="og:url" content="<?= $url ?>" />
  <meta name="twitter:url" content="<?= $url ?>" />
  <meta property="og:description" content="<?= $description ?>" />
  <meta name="twitter:description" content="<?= $description ?>" />
  <?php if ($image = $image->toFile()) : ?>
    <meta property="og:image" content="<?= $image->url() ?>" />
    <meta name="twitter:image" content="<?= $image->url() ?>" />
  <?php endif; ?>
  
  <?= Vite::reactRefreshRuntime() ?>
  <?= Vite::client() ?>
  <?= Vite::css("src/main.tsx") ?>
  <?= Vite::preloadFonts("src/main.tsx") ?>

</head>

<body>
  <script type="application/json" id="siteData"><?= json_encode($site->json()) ?></script>
  <div id="root"></div>
  <?= Vite::js("src/main.tsx") ?>
</body>

</html>