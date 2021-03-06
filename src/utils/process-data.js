export function normalizeAdvertiserData(merchants) {
  let pluralArrayValueFields = ['actions', 'linkTypes']
  let booleanValueFields = ['mobileTrackingCertified', 'performanceIncentives']

  return merchants.map(merchant => {
    let out = {}

    for (let dataItem in merchant) {
      if (merchant.hasOwnProperty(dataItem)) {
        out[dataItem] = pluralArrayValueFields.includes(dataItem) ? merchant[dataItem][0][dataItem.replace(/s$/, '')] : merchant[dataItem][0]
        out[dataItem] = booleanValueFields.includes(dataItem) ? out[dataItem] === 'true' : out[dataItem]
      }
    }

    out.primaryCategory = {
      parent: out.primaryCategory.parent[0],
      child: out.primaryCategory.child[0],
    }

    out.actions = out.actions.map(action => {
      let commission = action.commission[0]
      let defaultCommission = commission.default[0]

      if (defaultCommission._) {
        commission.default = {
          value: defaultCommission._,
          type: defaultCommission.$.type,
        }
      } else {
        commission.default = {
          value: defaultCommission,
        }
      }

      if (commission.itemlist) {
        commission.itemlist = commission.itemlist.map(item => ({
          value: item._,
          name: item.$.name,
          id: item.$.id,
        }))
      }

      return {
        name: action.name[0],
        type: action.type[0],
        id: action.id[0],
        commission,
      }
    })

    return out
  })
}

export function normalizeLinkData(links) {
  let numberValueFields = ['creativeWidth', 'creativeHeight']
  let dateValueFields = ['promotionStartDate', 'promotionEndDate']

  return links.map(link => {
    let out = {}
    for (let linkItem in link) {
      if (link.hasOwnProperty(linkItem)) {
        out[linkItem] = link[linkItem][0]
        out[linkItem] = numberValueFields.includes(linkItem) ? +out[linkItem] : out[linkItem]
        out[linkItem] = dateValueFields.includes(linkItem) && out[linkItem] ? new Date(out[linkItem]) : out[linkItem]
      }
    }
    return out
  })
}

export function normalizeTransactionData(transactions) {
  let booleanValueFields = ['original']
  let numberValueFields = ['commissionAmount', 'orderDiscount', 'saleAmount']
  let dateValueFields = ['eventDate', 'lockingDate', 'postingDate']

  return transactions.map(transaction => {
    let out = {}

    for (let dataItem in transaction) {
      if (transaction.hasOwnProperty(dataItem)) {
        out[dataItem] = transaction[dataItem][0]
        out[dataItem] = booleanValueFields.includes(dataItem) ? out[dataItem] === 'true' : out[dataItem]
        out[dataItem] = numberValueFields.includes(dataItem) ? +out[dataItem] : out[dataItem]
        out[dataItem] = dateValueFields.includes(dataItem) && out[dataItem] ? new Date(out[dataItem]) : out[dataItem]
      }
    }

    return out
  })
}

export function normalizeTransactionItemData(transactionItems) {
  let numberValueFields = ['quantity', 'publisherCommission', 'discount', 'saleAmount']
  let dateValueFields = ['postingDate']

  return transactionItems.map(transactionItem => {
    let out = {
      originalActionId: transactionItem.originalActionId,
    }

    out.items = (transactionItem.item || []).map(item => {
      let out = {}
      for (let dataItem in item) {
        if (item.hasOwnProperty(dataItem)) {
          out[dataItem] = item[dataItem][0]
          out[dataItem] = numberValueFields.includes(dataItem) ? +out[dataItem] : out[dataItem]
          out[dataItem] = dateValueFields.includes(dataItem) && out[dataItem] ? new Date(out[dataItem]) : out[dataItem]
        }
      }
      return out
    })

    return out
  })
}
