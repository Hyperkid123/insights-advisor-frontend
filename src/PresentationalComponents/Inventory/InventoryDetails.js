import '@redhat-cloud-services/frontend-components-inventory-insights/index.css';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/index';
import React, { Fragment, Suspense, useEffect, useState } from 'react';

import Breadcrumbs from '../../PresentationalComponents/Breadcrumbs/Breadcrumbs';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { PageHeader } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { entitiesDetailsReducer } from '../../AppReducer';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';

const InventoryDetail = React.lazy(() => import('insightsChrome/InventoryDetail'));
const AppInfo = React.lazy(() => import('insightsChrome/InventoryAppInfo'));
const DetailWrapper = React.lazy(() => import('insightsChrome/InventoryDetailWrapper'));

const InventoryDetails = ({ entity, match }) => {
    const store = useStore();
    const history = useHistory();
    const [isLoading, setIsLoaing] = useState(true);

    useEffect(() => {
        console.log('**************************************');
        console.log(window.insights.inventory.reducers.mergeWithDetail(entitiesDetailsReducer(window.insights.inventory.INVENTORY_ACTION_TYPES)));
        getRegistry().register({
            ...window.insights.inventory.reducers.mergeWithDetail(entitiesDetailsReducer(window.insights.inventory.INVENTORY_ACTION_TYPES))
        });
        setIsLoaing(false);
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <Suspense fallback={<Fragment />}>
            <DetailWrapper store={store}>
                <PageHeader className="pf-m-light ins-inventory-detail">
                    {entity && <Breadcrumbs
                        current={entity.display_name || entity.id}
                        match={match}
                    />}
                    <InventoryDetail store={store} history={history} hideBack />
                </PageHeader>
                <Main>
                    <Grid hasGutter>
                        <GridItem span={12}>
                            <AppInfo store={store} history={history} />
                        </GridItem>
                    </Grid>
                </Main>
            </DetailWrapper>
        </Suspense>
    );
};

InventoryDetails.contextTypes = {
    store: PropTypes.object
};

InventoryDetails.propTypes = {
    history: PropTypes.object,
    entity: PropTypes.object,
    addAlert: PropTypes.func,
    match: PropTypes.any
};

const mapStateToProps = ({ entityDetails, props }) => ({
    entity: entityDetails && entityDetails.entity,
    ...props
});

export default routerParams(connect(mapStateToProps, null)(InventoryDetails));
