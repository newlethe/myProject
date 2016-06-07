package com.sgepit.frame.sysman.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.sgepit.frame.sysman.hbm.AppTemplate;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.hbm.RockPosition;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockRole;
import com.sgepit.frame.sysman.hbm.RockRole2user;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.RockUser2dept;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.hbm.SysGolobal;
import com.sgepit.frame.sysman.hbm.SysPortletConfig;

/**
 * 系统管理业务逻辑接口.
 * 
 * @author xjdawu
 * @since 2007.11.21
 */
public interface SystemMgmFacade {
	
	/**
	 * 根据过滤条件取单位列表
	 * @param where
	 * @return
	 */
	public List<SgccIniUnit> getUnitListByWhere(String where);

	/**
	 * 根据指定的树标识符构造树
	 * @param treeName
	 * @param parentId
	 * @param attachUnit
	 * @param year
	 * @return
	 */
	List<TreeNode> buildTreeNodes(String treeName, String parentId,String attachUnit,String year);
	List<TreeNode> buildTreeNodes(String treeName, String parentId,String attachUnit,String year,String unitType);
	
	/**
	 * 根据父节点构造组织结构树
	 * @param parentId
	 * @param attachUnit
	 * @param year
	 * @return
	 */
	List<SgccIniUnit> buildTreeNodes(String parentId,String attachUnit,String year);

	
	/**
	 * 根据父节点构造组织结构树(不包括类型为岗位的节点)
	 * @param parentId
	 * @param attachUnit
	 * @param year
	 * @return
	 */
	List<SgccIniUnit> buildTreeNodesWithoutPos(String parentId,String attachUnit,String year);

	/**
	 * 获取系统功能模块列表
	 * @return 模块集合
	 */
	HashMap<String, RockPower> getModulesMap();
	
	/**
	 * 构造系统功能模块树
	 * @param parentId
	 * @param userid
	 * @param modulesMap
	 * @param includeFast 是否包含常用菜单
	 * @return
	 */
	public List<TreeNode> buildModuleConfigTreeNodes(String parentId, String userid,HashMap modulesMap, boolean includeFast);

	/**
	 * 获取用户的角色类型信息
	 * @param user
	 * @return
	 */
	String getUserRoleType(RockUser user);

	/**
	 * 获取用户有权限访问的模块集合
	 * 
	 * @param user
	 * @return 以模块id为key，模块本身为value的Map集合
	 */
	HashMap<String, RockPower> getUserModules(RockUser user);

	/**
	 * 从模块map中得到排序过的List
	 * 
	 * @param map 方法getUserModules()的返回值
	 * @param menu 是否不包含功能操作
	 * @return
	 * @throws Exception
	 */
	List<RockPower> getListedModules(HashMap<String, RockPower> map, boolean menu) throws BusinessException;

	/**
	 * 根据父节点id，从功能模块集合中得到排序过的所有子节点
	 * 
	 * @param parentId
	 * @param deep
	 * @return
	 * @throws BusinessException
	 */
	public List<RockPower> getListedModules(String parentId, boolean deep) throws BusinessException;
	
	/**
	 * 根据父节点获取模块列表
	 * 
	 * @param parentId 父节点的id
	 * @return List of SysModule
	 */
	List<RockPower> getModulesByParentId(String parentId);

	/**
	 * 新增模块
	 * 
	 * @param sysModule
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void insertModule(RockPower sysModule) throws BusinessException;

	/**
	 * 更新模块
	 * 
	 * @param sysModule
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void updateModule(RockPower sysModule) throws SQLException,
			BusinessException;

	/**
	 * 批量删除模块
	 * 
	 * @param ida 数组，SysModule的id
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void deleteModules(String[] ida) throws SQLException, BusinessException;

	/**
	 * 删除模块 删除顺序：删除权限信息（角色/模块表）、子模块（递归）、自身；最后更新父节点leaf属性
	 * 
	 * @param sysModule
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void deleteModule(RockPower sysModule) throws SQLException,
			BusinessException;

	/**
	  * 移动功能点位置
	  * @param powerPk 被移动的节点
	  * @param relationPk 
	  * @param type (in:在relationPk内；after:在relationPk下面；before:在relationPk上面)
	  * @return
	  * @throws BusinessException
	  **/
	public boolean moveModule(String powerPk,String relationPk,String type);
	
	/**
	 * 获取用户在指定模块中的功能操作权限信息
	 * 
	 * @param userModMap 用户所有的模块及功能操作集合
	 * @param modid 模块的ID
	 * @return HashMap 以功能操作ID为key，权限级别为value
	 */
	HashMap<String, String> getUserModuleActions(HashMap<String, RockPower> userModMap, String modid);

	/**
	 * 新增用户，同时记录创建用户的时刻
	 * 
	 * @param user
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void insertUser(RockUser user) throws SQLException, BusinessException;

	/**
	 * 更新用户
	 * 
	 * @param user
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void updateUser(RockUser user) throws SQLException, BusinessException;

	/**
	 * 用户登录验证
	 * 
	 * @param username
	 * @param password
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	RockUser authentication(String username, String password)
			throws SQLException, BusinessException;
	
	
	/**
	 * 待验证的方法
	 * @param username
	 * @param password
	 * @param chkPwd
	 * @return
	 * @throws SQLException
	 * @throws BusinessException
	 */
	RockUser authenticationPortal(String username, String password,boolean chkPwd)
	throws SQLException, BusinessException;

	/**
	 * 用户已经登录，记录用户登录时间
	 * 
	 * @param user
	 */
	void userLogon(RockUser user);

	/**
	 * 修改密码
	 * 
	 * @param userid
	 * @param oldpwd
	 * @param newpwd
	 * @throws BusinessException
	 */
	void savePassword(String userid, String oldpwd, String newpwd)
			throws BusinessException;

	/**
	  * 根据年度获取所有单位
	  * @param year
	  * @return
	  **/
	public List<SgccIniUnit> getAllUnitByYear(String year);
	
	/**
	 * 用户组织结构/岗位
	 * 
	 * @param user
	 * @return
	 */
	List<RockUser2dept> getUserOrg(RockUser user);

	/**
	  * 根据条件查询用户
	  * @param where
	  * @return
	  **/
	public List getUserByWhere(String where);
	
	/**
	 * 用户组织结构/岗位信息
	 * 
	 * @param user
	 * @return 以分号隔开多个组织结构，以逗号隔开组织结构/岗位
	 */
	String getUserDeptPosInfo(RockUser user);
	
	/**
	 * 获取用户所属组织机构名称
	 * @param user
	 * @return
	 */
	String getUserUnitName(RockUser user);

	/**
	 * 新增组织结构
	 * 
	 * @param sysOrg
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void insertOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException;
	
	/**
	 * 更新组织结构
	 * 
	 * @param sysOrg 组织机构
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void updateOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException;

	/**
	 * 批量删除组织结构
	 * 
	 * @param ida 由组织机构ID构成的字符串数组
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void deleteOrgs(String[] ida) throws SQLException, BusinessException;

	/**
	 * 删除单个组织结构
	 * 
	 * @param sysOrg 组织机构
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void deleteOrg(SgccIniUnit sysOrg) throws SQLException, BusinessException;

	/**
	 * 根据上级组织结构ID，得到排序过的所有下级组织结构
	 * 
	 * @param parentId 上级组织结构ID
	 * @param deep 是否递归
	 * @return 满足条件的组织结构集合
	 */
	List<SgccIniUnit> getListedOrgs(String parentId, boolean deep)
			throws BusinessException;
	
	
	/**
	 * 通过上级组织结构ID，获得所有下级组织结构的数量
	 * @param parentId
	 * @param hasPos 是否返回岗位信息
	 * @return
	 */
	public int getUnitCountByParentId(String parentId, boolean hasPos);

	/**
	 * 取全部岗位列表
	 * 
	 * @return 岗位集合
	 */
	//List<SysPosition> getPositions();

	/**
	 * 根据组织结构ID，获取该组织结构下的岗位列表
	 * 
	 * @param orgid 组织结构ID
	 * @return 岗位集合
	 */
	//List<SysPosition> getOrgPositions(String orgid);

	/**
	 * 新增角色模块关系
	 * 
	 * @param rolemod
	 */
	void insertRolemod(Object rolemod);

	/**
	 * 删除角色模块关系
	 * 
	 * @param roleid
	 */
	void deleteRoleMod(String roleid);

	/**
	 * 根据角色ID，获取模块树及角色的权限级别
	 * 
	 * @param roleid
	 * @param unitid
	 * @return JSON格式的树结构信息
	 * @throws BusinessException
	 */
	String getRoleModTree(String roleid, String unitid) throws BusinessException;

	/**
	 * 取角色列表
	 * 
	 * @return 角色集合
	 */
	List<RockRole2user> getRoles();

	/**
	 * 通过组织机构ID查找相关联的用户，带分页
	 * 
	 * @param orderby 排序
	 * @param start
	 * @param limit
	 * @param orgid 组织机构ID
	 * @return
	 */
	List<RockUser> findUserByOrg(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid);
	List<RockUser> findUserByOrgNotInManInfo(String orderby, Integer start, Integer limit,
			HashMap<String, String> orgid);
	/**
	 * 通过角色ID查找相关联的用户，带分页
	 * 
	 * @param orderby 排序
	 * @param start
	 * @param limit
	 * @param roleid 角色ID
	 * @return
	 */
	List<RockUser> findUserByRole(String orderby, Integer start, Integer limit,
					HashMap<String, String> roleid);
	/**
	 * 保存角色的模块权限关系
	 * 
	 * @param roleid 角色ID
	 * @param jab 角色模块关系集合
	 */
	void saveRolemod(String roleid, UpdateBeanInfo jab);

	/**
	 * 在组织机构之间移动或复制用户
	 * @param ida　多个用户的userid组成的字符串
	 * @param oldOrgid 要移动或复制的用户所在的源组织机构id
	 * @param newUnitId 要移动或复制到的目标组织机构id
	 * @param newDeptId 移动或复制到的目标部门id；
	 * @param newPosId	移动或复制到的目标岗位id；
	 * @param move 标示符，表示移动还是复制
	 */
	void moveUser(String[] ida, String oldOrgid, String newUnitId, String newDeptId, String newPosId, String move);

	/**
	 * 为用户设置默认的口令
	 * @param ida
	 * @param defaultPassWord
	 */
	void setUserPassword(String[] ida, String defaultPassWord);
	
	/**
	 * 将用户从当前组织机构中移除，如果用户不在任何一个非根节点的组织结构内，那么将用户放置在根节点内
	 * @param ida
	 * @param orgid
	 */
	void deleteUserorg(String[] ida, String orgid);
	
	/**获取部门ID
	 * 
	 * @param user
	 * @return
	 */
	String getUserDeptId(RockUser user); 
	
	/**获取用户岗位Id
	 * 
	 * @param user
	 * @return
	 */
	String getUserPosId(RockUser user); 
	
	/**
	 * 通过组织机构ID过滤用户，带分页,资料电子文档密级
	 * @param orderby
	 * @param start
	 * @param limit
	 * @param orgid
	 * @return
	 */
	List<RockUser> findUserByOrgOther(String orderby, Integer start, Integer limit,
					HashMap<String, String> orgid);
	
	
	/**更新角色
	 * 
	 * @param role
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void updateRole(RockRole role) throws SQLException, BusinessException ;
	
	
	
	/**
	 * 新增属性管理信息
	 * @param type
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void insertPropertyType(PropertyType type) throws SQLException,BusinessException;
	
	/**
	 * 更新属性管理信息，同时删除属性代码信息
	 * @param type
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void updatePropertyType(PropertyType type) throws SQLException,BusinessException;
	
	/**
	 * 删除属性管理信息，同时删除属性代码信息
	 * @param type
	 * @throws SQLException
	 * @throws BusinessException
	 */
	void deletePropertyType(PropertyType type) throws SQLException,BusinessException;
	
	/**
	 * 锁定用户，不允许登录
	 * @param username
	 */
	void lockUser(String username);
	
	/**
	 * 转换column树的json串
	 * @param unitid
	 * @return
	 */
	public String convertUnitColumnJson(String unitid , String pubId , String type , String treeType);
	
	/**
	  * 根据property_name获得属性信息
	  * @param catagory
	  * @return
	  **/
	public List getCodeValue(String catagory);
	
	/**
	 * 根据单位ID获取单位对象信息
	 * @param unitid
	 * @return
	 */
	public SgccIniUnit getUnitById(String unitid);
	
	/**
	 * 通过上级单位ID，获得下级单位的个数
	 */
	public int getUnitCountByParentId(String parentId);
	
	/**
	 * 获取角色权限
	 * @param roleType
	 * @param unitId
	 * @return
	 */
	public List<RockRole> getRolesByPrivilege(String roleType,String unitId);
	/**
	 * 新增角色
	 * @param role
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void insertRole(RockRole role) throws SQLException, BusinessException;
	/**
	 * 删除角色
	 * @param role
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void deleteRole(RockRole role) throws SQLException, BusinessException;
	/**删除用户
	 * 
	 * @param user
	 * @throws SQLException
	 * @throws BusinessException
	 */
	public void deleteUser(RockUser user) throws SQLException, BusinessException;
	/**
	 * 获取系统岗位列表
	 * @return
	 */
	public List getPositions();
	/**
	 * 获取指定组织机构下的岗位列表
	 * @param orgid
	 * @return
	 */
	public List getOrgPositions(String orgid);
	/**
	 * 新增岗位
	 * @param position
	 * @throws BusinessException
	 */
	public void insertPosition(RockPosition position) throws BusinessException;
	/**
	 * 删除岗位
	 * @param position
	 * @throws BusinessException
	 */
	public void deletePosition(RockPosition position) throws BusinessException;
	/**
	 * 更新岗位
	 * @param position
	 * @throws BusinessException
	 */
	public void updatePosition(RockPosition position) throws BusinessException;
	/**
	 * 构造ColumnTree
	 * @param treeName
	 * @param parentId
	 * @param params
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	/**
	 * 在用户当前可访问的功能模块树中，根据父节点获取所有子节点
	 * @param parendId
	 * @param session
	 * @return
	 */
	public List getChildRockPowersByParentId(String parendId, HttpSession session);
	/**
	 * 在用户当前可访问的功能模块树中，根据父节点获取所有子节点构成的树
	 * @param parentId
	 * @param session
	 * @return
	 */
	public String getChildRockPowerStr(String parentId, HttpSession session);
	public String getTreeByPk(String parentId, HttpSession session);
	/**
	  * 设为常用操作
	  * @param powerPk
	  * @param targetPk
	  * @param userId
	  * @param type
	  * @return
	  **/
	public String addCommonPower(String powerPk,String targetPk,String userId,String type)throws BusinessException;
	
	/**
	  * 删除常用操作
	  * @param powerPk
	  * @param userId
	  **/
	public void deleteCommonPower(String powerPk,String userId);
	/**
	 * 新增Office文档模板
	 * @param appTemplate
	 * @throws BusinessException
	 */
	public void insertTemplate(AppTemplate appTemplate) throws BusinessException;
	/**
	 * 更新Office文档模板
	 * @param appTemplate
	 * @throws BusinessException
	 */
	public void updateTemplate(AppTemplate appTemplate) throws BusinessException;
	/**
	 * 删除Office文档模板
	 * @param appTemplate
	 */
	public void deleteTemplate(AppTemplate appTemplate);
	/**
	 * 删除Office文档模板
	 * @param ida
	 */
	public void deleteTemplates(String[] ida);
	
	/**
	 * 获取用户常用操作
	 * @param userid
	 * @return
	 */
	public List<RockPower> getFastModulesByUserId(String userid);
	/**
	 * 构造用户常用操作树
	 * @param parentId
	 * @param userId
	 * @param modulesMap
	 * @return
	 */
	public List<?> buildFastModuleTreeNodes(String parentId, String userId,
			HashMap<String, RockPower> modulesMap);
	/**
	 * 获取用户Portlet配置信息列表
	 * @param userid
	 * @return
	 */
	public List<SysPortletConfig> getUserPortletConfig(String userid);
	/**
	 * 获取角色Portlet配置信息列表
	 * @param roleid
	 * @return
	 */
	public List<SysPortletConfig> getRolePortletConfig(String roleid);
	
	/**
	 * 初始化系统管理员和公共用户角色的Portlet配置 
	 */
	public void initRolePortlets();
	/**
	 * 获取模块图标样式
	 * @return
	 */
	public String getModulesIconClsStr(); 
	/**
	 * 更新用户Portlet配置
	 * @param config
	 */
	public void updatePortletConfig(SysPortletConfig config);
	
	/**
	 * 给指定用户关联新的角色
	 * @param rru
	 */
	public void insertUserRole(RockRole2user rru);
	/**
	 * 更新用户关联的角色
	 * @param rru
	 * @throws BusinessException
	 */
	public void updateUserRole(RockRole2user rru) throws BusinessException; 
	/**
	 * 删除指定用户的某个角色
	 * @param rru
	 */
	public void deleteUserRole(RockRole2user rru);	
	/**
	 * 获取系统中组织结构Map对象
	 * @param rru
	 */
	public Map<String,SgccIniUnit> getUnitMap();
	
	public String getModuleIdByName(String modulename, String parent) ;
	public String getFavTree(String userId, HttpSession session);
	public String getFavChildPowerInTreeNode(RockPower parent,Map<String,String> resultMap, HttpSession session);
	public String addFavs(String userid,String powerpks);
	public String addFav(String powerpk,String userid);
	public String getFavByUserID(String userID);
	public String updateOrder(String userid,String powerpk,String relationPk,String type);
	public void setTreeOrderCode(List list);
	public boolean setShowTab(String userid, int index);
	/**
	 * 组织结构树的获取，一般配合SysServlet使用，ac=buildingUnitTree,paramsmap存放由客户端采用get或post传递的参数
	 * @param paramsmap
	 * @return
	 */
	public String buildingUnitTree(Map paramsmap);
	public String buildingRockPowerTree(Map paramsmap);
	public String saveUnitRockPower(String pks ,String unitIds);
	//保存文件属性配置名称
	public String saveSysGolobal(SysGolobal sysGolobal);
	/**
	 * 根据文件名称 文件路径和文件类型查找文件中的属性列表
	 * @param filepath
	 * @param filename
	 * @param filetype
	 * @return
	 */
	public List findPropertyOrClassByProperty(String filepath,String filename,String filetype);
	/**
	 * 通过单位id查询其所管理的项目单位
	 * @param unitid
	 * @return
	 */
	public List<SgccIniUnit> getPidsByUnitid(String unitid);
	public String switchByPid(String pid, HttpSession session);
	/**
	 * 获取子系统的第一个具备权限的功能模块（即第一个具备权限，且URL不为空的模块）
	 * @param subSystemId   子系统模块ID
	 * @param userId        当前用户ID
	 * @return              模块实体
	 */
	public RockPower getFirstPowerFromSubSystem(String subSystemId,String userId);

	/**
	 * 获取当前用户的所属单位，可作为所属单位的类型取自system.properties 的 USERBELONGUNITTYPE
	 * @param unitid
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 14, 2011
	 */
	public SgccIniUnit getBelongUnit(String unitid);
	
	/**
	 * 获取功能模块业务流程流转的形式
	 * @param pid
	 * @param powerPk
	 * @return
	 * 返回功能模块流程运转的形式，包括下面四个值：
			None：该模块不允许流程审批（及从业务上不存在审批）；
			BusinessProcess：通过业务流程平台运转；
			ChangeState：通过手动的方式修改流程审批状态；
			ChangeStateAuto：自动修改流程审批状态（即录入时自动设置流程状态为已审批）；

	 */
	public String getFlowType(String pid,String powerPk);
	
	/**
	 *	组织机构的数据交换：项目单位的组织机构同集团公司保持一致；
	 * @param:	pid			项目单位向集团上报数据的时候，项目单位的PID；如果此项为NUll或“”，表示集团向项目单位下达数据；
	 * @author: Liuay
	 * @createDate: Sep 19, 2011
	 */
	public void unitDataExchange(String pid);
	
	/**
	 * 用户信息数据交换
	 * @param unitId	需要处理的用户所在单位
	 * @param sendType	数据交换类型：UP：项目单位->集团；DOWN:集团->项目单位
	 * @author: Liuay
	 * @createDate: 2011-9-22
	 */
	public void userDataExchange(String unitId, String sendType);
	
	/**
	 * 将属性代码property_type和property_code导出为sql语句
	 * @param uidsArr 所选属性代码的主键uids组成的数组
	 * @return 返回生成的sql语句
	 * @author zhangh
	 */
	public String createPropertyInsertSql(String[] uidsArr);
	/**
	 * 根据PID将属性代码生成的SQL语句交换到对应项目单位或者上报集团
	 * @param uidsArr
	 * @return
	 * @author zhangh
	 */
	public String exchangeDataToSendProperty(String[] uidsArr, String typeNameArr,String pid);

	/**
	 * 根据二级模块ID过滤项目单位，数据提供给功能页面切换项目单位的combo
	 * @param modid 二级模块id
	 * @return
	 * @author zhangh 2012-05-18
	 */
	public List<SgccIniUnit> findUnitsByModid(String modid,String belongUnitid);
	
	/**
	 * 记录用户登陆时间和IP
	 * @param userid
	 * @param ip
	 * @author zhangh 2013-01-11
	 */
	public void saveUserLoginTimeAndIp(String userid, String ip);
	/**
	 * 
	* @Title: saveUserOperateModule
	* @Description: 记录用户操作模块
	* @param userid  用户id
	* @param ip  用户ip地址
	* @param moduleid   模块id 
	* @return void    
	* @throws
	* @author qiupy 2013-5-7
	 */
	public void saveUserOperateModule(String userid,String ip,String moduleid);
	
	
	/**
	 * 查询当前登录用户所具有的权限的模块
	 * 目前只在集团调整导航栏后使用
	 * @author zhangh 2014-2-9
	 * @return
	 */
	public String getNaviMenus(String parentId, HttpSession session, String indexModid);
}