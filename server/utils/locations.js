'use strict';

function checkLocationParent(resLocationParent, data) {
    const isExist = resLocationParent.some((item) => {
        if (item.location_parent == null) {
            return data == item.slug;
        }
    });

    return isExist;
}

const locationParent = (allLocation) => {
    const location = allLocation.filter((item) => {
        return item.location_parent?.id == item.id;
    });
    return location;
};

const checkExistLocationParent = (locationNew, allLocationParent) => {
    const isExist = allLocationParent.some(
        (item) => locationNew.slug == item.slug
    );
    return isExist;
};

const locationChild = (allLocation, idLocationParent) => {
    if (idLocationParent != null) {
        const location = allLocation.filter(
            (item) => item.location_parent?.id == idLocationParent
        );
        return location;
    } else {
        return [];
    }
};

const checkExistLocationChild = (allLocationChild, item) => {
    const isExist = allLocationChild.some((elem) => elem.slug == item.slug);
    return isExist;
};

module.exports = {
    checkLocationParent,
    locationParent,
    checkExistLocationParent,
    locationChild,
    checkExistLocationChild,
};
