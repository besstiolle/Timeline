// A simple reactif object shared between Draw|Live|Online|Upload|Version and ShadownBox components
// Allow sharing state like "showing / hidding components"
export const shadowBoxComponentState = $state({
    openShadowBoxForLiveEdition: false,
    openShadowBoxForOnline: false,
    openShadowBoxForUpload: false,
    openShadowBoxForVersion: false
});