import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  FiatEligibleType,
  FiatType,
  RemoteDataType,
  SBCardType,
  SBPairType,
  SBPaymentMethodsType,
  SupportedCoinsType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import Failure from './template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class CryptoSelection extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.fetchSBPairs(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'USD'
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = {
  cards: Array<SBCardType>
  eligibility: FiatEligibleType
  pairs: Array<SBPairType>
  paymentMethods: SBPaymentMethodsType
  rates: { [key in CoinType]: RatesType }
  supportedCoins: SupportedCoinsType
}
export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: FiatType
}
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CryptoSelection)