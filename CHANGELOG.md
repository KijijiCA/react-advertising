# Changelog

## 2.1.0 / 10 July 2019

* Add outOfPageSlot functionality - see [Google documentation](https://support.google.com/admanager/answer/6088046?hl=en)
* Add new plugin hook "setup"
* See [PR 14](https://github.com/technology-ebay-de/react-prebid/pull/14)

## 2.0.1 / 18 June 2019

When the `AdvertisingProvider` unmounted when it didn't have a config, a null pointer execption
ocurred. This was fixed.

* See [PR 13](https://github.com/technology-ebay-de/react-prebid/pull/13)

## 2.0.0 / 16 June 2019

You can now update the `AdvertisingProvider` by re-rendering it with a different configuration prop than before.

When the AdvertisingProvider receives a new config prop, it will automatically tear down GPT and Prebid and set them up again with the updated configuration, causing all the ad slots in the container to get refreshed with new ads according to the new config.

* See [documentation](https://github.com/technology-ebay-de/react-prebid/wiki/Advanced-Usage#updating-the-configuration-after-initial-rendering)

Thanks [Jason Li](https://github.com/sundy001) for implementing this!

**Breaking Change**

In previous versions, if the `config` prop for the `AdvertisingProvider` changed, this was ignored,
now it causes GPT and Prebid to be re-initialized and ad slots to be refreshed with the updated config.

While we believe this to be the desired effect, some users may depend on the old “ignorant” behavior,
hence we decided to roll out this change as a major release.

## 1.1.0 / 28 May 2019

You can now render the `AdvertisingProvider` without a config prop. This is useful when you
load the ad config asynchronously and don't want to block initial page render.

* See [documentation](https://github.com/technology-ebay-de/react-prebid/wiki/API#advanced-usage-passing-the-config-prop-later)
* See [issue #10](https://github.com/technology-ebay-de/react-prebid/issues/10)

Thanks [Jason Li](https://github.com/sundy001) for implementing this!

## 1.0.9 / 9 Oct 2018

* dependency update to fix security issues found by npm audit

## 1.0.8 / 26 Jun 2018

* tests and other superfluous files excluded from npm package

## 1.0.7 / 26 Jun 2018

* removed obsolete prebid size mapping code that doesn't work with Prebid 1
* added `prebid.sizeConfig` to advertising config prop type
* added `prebid.bids.labelAny` and `prebid.bids.labelAll` to advertising slot config prop type

## 1.0.6 / 25 Jun 2018

*   added “displaySlots” to plugin lifecycle phases

## 1.0.5 / 25 Jun 2018

*   adjusted config prop type for size mapping config, now allowing string for named sizes (i.e. `fluid`)

## 1.0.4 / 25 Jun 2018

*   fixed critical issue with responsive ads size mappings; it did not work properly with prior versions

## 1.0.3 / 13 Jun 2018

*   adjusted prop types for slot config to allow passing just one size

## 1.0.2 / 13 Jun 2018

*   bug fix: GPT sizes are now added correctly

## 1.0.1 / 12 Jun 2018

*   adjusted advertising config prop type to allow specifying Prebid price granularity as object

## 1.0.0 / 24 Apr 2018

*   compatible with React 16.3 and greater

## 0.1.0 / 19 Apr 2018

Initial release

*   compatible with Prebid 1.x
*   compatible with React 15.x
