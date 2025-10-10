# Vendor brand sources and acquisition plan

This doc lists official brand/press resources for each vendor and whether a direct SVG URL is typically available. Use this alongside `assets/images/vendor-logos/sources.json` and `npm run update:logos`.

Placeholders to replace (exact filenames):

cisco.svg, isc2.svg, pmi.svg, peoplecert.svg, vmware.svg, googlecloud.svg, isaca.svg, giac.svg, iapp.svg, csa.svg, redhat.svg, linuxfoundation.svg, netapp.svg, veeam.svg, splunk.svg, citrix.svg, juniper.svg, suse.svg, fortinet.svg, oracle.svg, nokia.svg, unity.svg

---

- Cisco
  - Brand kit: https://newsroom.cisco.com/c/r/newsroom/en/us/press-room/logo-guidelines.html
  - Brand Exchange: https://bx.cisco.com/ (login/VPN required)
  - Trademarks: https://www.cisco.com/c/en/us/about/legal/trademarks.html
  - Status: Manual download required via Brand Exchange; paste direct SVG to `sources.json` or upload to `_official-source/` as `cisco.svg`.

- Google Cloud
  - Brand Resource Center: https://about.google/brand-resource-center/
  - Status: Manual download (Google brand site); paste direct SVG URL (if provided) or upload as `googlecloud.svg`.

- Red Hat
  - Brand Standards: https://www.redhat.com/en/about/brand/standards
  - Status: Usually via brand kit; manual download. Filename: `redhat.svg`.

- VMware / Omnissa
  - VMware logo guidelines: https://news.broadcom.com/media-library/vmware-logo-guidelines
  - Omnissa brand info: https://www.omnissa.com/
  - Status: Manual download; Filename: `vmware.svg` (matches vendorLogoMap).

- Oracle
  - Newsroom: https://www.oracle.com/news/resources/
  - Third-party logo guidelines: https://www.oracle.com/legal/logos/
  - Status: Manual download; Filename: `oracle.svg`.

- SUSE
  - Brand guides: https://brand.suse.com/
  - Status: Manual download; Filename: `suse.svg`.

- Fortinet
  - Guidelines (example PDF): https://informaticaempresarial.mx/wp-content/uploads/2021/02/Fortinet-Brand-Guidelines-Partnerv2.3.pdf
  - Official artwork: brand@fortinet.com
  - Status: Request via email or partner portal; Filename: `fortinet.svg`.

- Splunk
  - Trademark usage: https://www.splunk.com/en_us/legal/trademark-usage-guidelines.html
  - Status: Manual download; Filename: `splunk.svg`.

- (ISC)²
  - Site: https://www.isc2.org/
  - Status: Manual download; Filename: `isc2.svg`.

- PMI
  - Site: https://www.pmi.org/
  - Status: Manual download; Filename: `pmi.svg`.

- ISACA
  - Brand guidelines: https://brand.isaca.org/
  - Status: Manual download; Filename: `isaca.svg`.

- Linux Foundation
  - Trademark usage: https://www.linuxfoundation.org/legal/trademark-usage
  - Status: Manual download; Filename: `linuxfoundation.svg`.

- Citrix
  - Media resources: https://www.citrix.com/news/media-resources.html
  - Status: Manual download; Filename: `citrix.svg`.

- Juniper (HPE Juniper Networking)
  - Logos/photos: https://www.juniper.net/us/en/company/images/image-library-logos-and-product-photos/logos.html
  - Guidelines: https://www.juniper.net/content/dam/www/assets/design-guides/us/en/logo-usage-guidelines.pdf
  - Status: Manual download; Filename: `juniper.svg`.

- NetApp
  - Trademarks: https://www.netapp.com/company/legal/trademarks/
  - Status: Manual download; Filename: `netapp.svg`.

- Veeam
  - Brand Resource Center: https://www.veeam.com/company/brand-resource-center.html
  - Status: Manual download; Filename: `veeam.svg`.

- Nokia
  - Media resources (logo): https://www.nokia.com/about-us/newsroom/media-resources/media-library/nokia-logo/
  - Status: Manual download; Filename: `nokia.svg`.

- Unity
  - Brand guidelines: https://support.unity.com/hc/en-us/articles/30238757069332-Are-there-guidelines-for-using-the-Unity-Logo
  - Status: Manual download; Filename: `unity.svg`.

- CSA
  - Cloud Security Alliance: https://cloudsecurityalliance.org/
  - Status: Check media/brand page; Filename: `csa.svg`.

- GIAC
  - GIAC Certifications: https://www.giac.org/
  - Credly badges: https://www.credly.com/org/global-information-assurance-certification-giac
  - Status: Manual download; Filename: `giac.svg`.

- IAPP
  - Resources: https://iapp.org/resources/
  - Digital stickers: https://iapp.org/resources/article/iapp-digital-stickers/
  - Status: Manual download; Filename: `iapp.svg`.

- PeopleCert
  - Site: https://www.peoplecert.org/
  - Membership resources: https://www.peoplecert.org/Membership
  - Status: Manual download; Filename: `peoplecert.svg`.

## Workflow

1. Acquire approved SVGs from the sources above (brand kits or media pages) per their guidelines.
2. Place files in `_official-source/` using the exact filenames listed.
   - Or paste direct SVG URLs into `sources.json` and run `npm run update:logos`.
3. Verify with `npm run check:logos` — placeholders count should drop.
