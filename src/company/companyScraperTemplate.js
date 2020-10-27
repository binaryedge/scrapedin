const template = {
    profile: {
        selector: '.org-top-card',
        fields: {
            name: `h1`,
            headline: `p`,
            imageurl: {
                selector: `img.org-top-card-primary-content__logo`,
                attribute: 'src'
            }
        }
    },
    about: {
        selector: '.org-grid__core-rail--no-margin-left',
        fields: {
            overview: 'p',
            types:{
                selector: 'dl dt',
                isMultipleFields: true
            },
            values:{
                selector: 'dl dd:not(.org-page-details__employees-on-linkedin-count)',
                isMultipleFields: true
            }
        }
    },
    people: {
        selector: "li.org-people-profiles-module__profile-item",
        fields: {
            full_name: "div.org-people-profile-card__profile-title",
            profile_path: {
                selector: "a[data-control-name=people_profile_card_image_link]",
                attribute: 'href'
            }
        }
    },
    people_list: {
        selector: "li.search-result__occluded-item",
        fields: {
            full_name: "span.name.actor-name",
            profile_path: {
                selector: "a[data-control-name=search_srp_result]",
                attribute: 'href'
            }
        }
    }
}


module.exports = template