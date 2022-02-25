export function roleListNameTranslator (roleListType) {
  switch (roleListType) {
    case 'goodCampRoleList':
      return '好人陣營'
    case 'badCampRoleList':
      return '壞人陣營'
    case 'funRoleList':
      return '功能身分'
  }
}

export function roleNameTranslator (state, roleListType, roleId) {
  if (roleListType === 'labelResult') return '標記結果'
  if (roleId === 'all') return '全部'
  const result = state[roleListType].filter(role => role.id === roleId)[0]
  if (!result) return 'error: 角色不存在'
  return result.name
}
