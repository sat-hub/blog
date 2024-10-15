<?php

declare(strict_types=1);

/*
 * This file is part of the package t3g/blog.
 *
 * For the full copyright and license information, please read the
 * LICENSE file that was distributed with this source code.
 */

namespace T3G\AgencyPack\Blog\Tests\Functional\Updates;

use T3G\AgencyPack\Blog\Updates\FeaturedImageUpdate;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

/**
 * @extensionScannerIgnoreFile
 */
final class FeaturedImageUpdateTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = [
        'form'
    ];

    protected array $testExtensionsToLoad = [
        'typo3conf/ext/blog'
    ];

    /**
     * @test
     */
    public function noUpdateNecessaryTest(): void
    {
        $subject = new FeaturedImageUpdate();
        self::assertFalse($subject->updateNecessary());
    }

    /**
     * @test
     */
    public function updateTest(): void
    {
        $subject = new FeaturedImageUpdate();
        $this->importCSVDataSet(__DIR__ . '/Fixtures/BlogBasePages.csv');
        $this->importCSVDataSet(__DIR__ . '/Fixtures/FeaturedImageUpdate/Input.csv');
        self::assertTrue($subject->updateNecessary());
        $subject->executeUpdate();
        self::assertFalse($subject->updateNecessary());
        $this->assertCSVDataSet(__DIR__ . '/Fixtures/FeaturedImageUpdate/Result.csv');

        // Just ensure that running the upgrade again does not change anything
        $subject->executeUpdate();
        $this->assertCSVDataSet(__DIR__ . '/Fixtures/FeaturedImageUpdate/Result.csv');
    }
}
