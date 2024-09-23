<?php


class Vite
{
  static $devServerUrl = "http://localhost:8001";
  static $buildDir = "assets/build";

  
  static function devRoot() {
    return self::$devServerUrl . '/' . self::$buildDir;
  }

  static function clientUrl() {
    return self::devRoot() . '/@vite/client';
  }

  static function buildRoot() {
    return '/' . self::$buildDir;
  }

  static function isDev()
  {
    static $isDev = null;
    if ($isDev !== null) return $isDev;
    $isLocalhost = $_SERVER['HTTP_HOST'] === 'localhost:8000';
    if (!$isLocalhost) return $isDev = false;
    $handle = curl_init(self::clientUrl());
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_NOBODY, true);
    curl_exec($handle);
    $error = curl_errno($handle);
    curl_close($handle);
    return $isDev = !$error;
  }

  static function manifest(string $entry)
  {
    static $manifest = null;
    if ($manifest === null) {
      $asset = asset("assets/build/.vite/manifest.json");
      if (!$asset->exists()) {
        return null;
      } else {
        $manifest = json_decode($asset->read(), true);
      }
    }
    if (isset($manifest[$entry])) {
      return $manifest[$entry];
    } else {
      throw new Exception("File $entry not in manifest");
    }
  }

  static function reactRefreshRuntime() {
    // https://github.com/vitejs/vite/issues/1984#issuecomment-778403608
    if (!self::isDev()) return "";
    $url = self::devRoot() . '/@react-refresh';
    return <<<EOD
    <script type="module">
        import RefreshRuntime from "$url"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.\$RefreshReg$ = () => {}
        window.\$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    EOD;
  }

  static function client()
  {
    if (!self::isDev()) return "";
    return js(self::clientUrl(), ["type" => "module"]);
  }

  static function css($entry)
  {
    if (self::isDev()) return "";
    $manifestEntry = self::manifest($entry);
    if (!$manifestEntry) return "";
    $tags = [];
    if (!empty($manifestEntry["css"])) {
      foreach ($manifestEntry["css"] as $css) {
        $url = self::buildRoot() . '/' . $css;
        $tags[] = "<link rel='stylesheet' href='$url'>";
      }
    }
    return implode("\n", $tags);
  }

  static function js($entry)
  {
    if (self::isDev()) {
      $url = self::devRoot() . '/' . $entry;
      return js($url, [
        "type" => "module",
        "crossorigin" => true
      ]);
    } else {
      $manifestEntry = self::manifest($entry);
      if (!$manifestEntry) return "";

      $tags = [];

      $tags[] = js(self::buildRoot() . '/' . $manifestEntry["file"], ["type" => "module"]);

      if (!empty($manifestEntry["imports"])) {
        foreach ($manifestEntry["imports"] as $import) {
          $url = self::buildRoot() . self::manifest($import)["file"];
          $tags[] = "<link rel='modulepreload' href='$url'>";
        }
      }

      return implode("\n", $tags);
    }
  }

  const fontExtensions = ["ttf", "otf", "eot", "woff", "woff2"];
  static function preloadFonts(string $entry)
  {
    if (self::isDev()) return "";
    $manifestEntry = self::manifest($entry);
    if (!$manifestEntry) return "";
    if (!isset($manifestEntry["assets"])) return "";
    foreach ($manifestEntry["assets"] as $asset) {
      $ext = pathinfo($asset, PATHINFO_EXTENSION);
      if (in_array($ext, self::fontExtensions)) {
        $url = self::buildRoot() . $asset;
        echo "<link rel='preload' href='$url' as='font' type='font/$ext' crossorigin>";
      }
    }
  }
}
