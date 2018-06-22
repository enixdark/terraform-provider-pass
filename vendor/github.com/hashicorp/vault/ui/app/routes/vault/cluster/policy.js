import Ember from 'ember';
import ClusterRoute from 'vault/mixins/cluster-route';

const ALLOWED_TYPES = ['acl', 'egp', 'rgp'];
const { inject } = Ember;

export default Ember.Route.extend(ClusterRoute, {
  version: inject.service(),
  beforeModel() {
    return this.get('version').fetchFeatures().then(() => {
      return this._super(...arguments);
    });
  },
  model(params) {
    let policyType = params.type;
    if (!ALLOWED_TYPES.includes(policyType)) {
      return this.transitionTo('vault.cluster.policies', ALLOWED_TYPES[0]);
    }
    if (!this.get('version.hasSentinel') && policyType !== 'acl') {
      return this.transitionTo('vault.cluster.policies', policyType);
    }
    return {};
  },
});
