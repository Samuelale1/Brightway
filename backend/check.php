<?php
echo "PHP Version: " . PHP_VERSION . "\n";
echo "PATH: " . getenv('PATH') . "\n";
file_put_contents('env_check.txt', "PHP Version: " . PHP_VERSION . "\n" . "PATH: " . getenv('PATH'));
