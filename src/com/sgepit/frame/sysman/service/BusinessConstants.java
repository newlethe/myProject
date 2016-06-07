package com.sgepit.frame.sysman.service;

import java.util.Map;



/**
 * 业务逻辑层使用的常量
 * 
 * @author xjdawu
 * @since 2007.11.30
 */
public class BusinessConstants {

	/*
	 * 通用部分
	 */
	public static final String MSG_UNKOWN_PROPERTY_TYPE = "findByProperty: 无法处理的属性值类型";

	/*
	 * 系统管理部分
	 */

	public static final String SYS_PACKAGE = "com.sgepit.frame.sysman.hbm.";
	public static final String SYS_MODULE = "RockPower";
	public static final String SYS_MODULE_USER = "RockPowerUser";
	public static final String SYS_USER = "RockUser";
	public static final String SYS_ORG = "SgccIniUnit";
	public static final String SYS_ROLE = "RockRole";
	public static final String SYS_POSITION = "RockPosition";
	public static final String SYS_ORGPOS = "RockUnitpos";
	public static final String SYS_ROLEMOD = "RockCharacter2power";
	public static final String SYS_USERORG = "RockUser2dept";
	public static final String SYS_USERROLE = "RockRole2user";
	public static final String SYS_CODECATAGORY = "PropertyCode";
	public static final String SYS_TYPECATAGORY = "PropertyType";
	public static final String SYS_TEMPLATE = "SgccGuidelineModelMaster";
	public static final String SYS_TEMPLATE_DETAIL = "SgccGuidelineModelDetail";
	public static final String SYS_PORTLET = "SysPortletConfig";
	/*
	 * 大对象文件内容
	 */
	public static final String ROCKUSER_PACKAGE = "com.sgepit.frame.sysman.hbm.";
	public static final String ROCKUSER = "RockUser";
	/*
	 * 单位信息
	 */
	public static final String INIUNIT_PACKAGE = "com.sgepit.frame.sysman.hbm.";
	public static final String INIUNIT = "SgccIniUnit";
	
	

	public static final String TREE_SYS_MODULE = "SysModuleTree";
	public static final String TREE_SYS_ORG = "SysOrgTree";
	public static final String TREE_GUIDELINE = "GuidelineTree";
	public static final Object TREE_ENTITYBEAN = "EntityBean";
	//var statusList = [['1', '激活'],['2', '锁定'],['0', '禁用']];
	public static final String IDF_SYS_USER_ACTIVE = "1"; //可用
	public static final String IDF_SYS_USER_FREEZE = "0"; //用户不可用
	public static final String IDF_SYS_USER_LOCK = "2";  //用户被锁定

	public static final Integer IDF_SYSORG_COMPANYGROUP = 0; // 集团
	public static final Integer IDF_SYSORG_COMPANY = 1;		 // 公司
	public static final Integer IDF_SYSORG_DEPT = 2;		 // 部门
	public static final Integer IDF_SYSORG_OFFICE = 3;		 // 科室
	public static final Integer IDF_SYSORG_OTHERS = 4;		 // 其他
	
	
	public static final Integer LOGIN_FAIL_LIMIT = 5;		 // 登录失败限制次数
	
	

	public static final Integer IDF_SYSROLE_ALL = 1; // 完全控制
	public static final Integer IDF_SYSROLE_WRITE = 2; // 写
	public static final Integer IDF_SYSROLE_READ = 3; // 读
	public static final Integer IDF_SYSROLE_DISABLED = 4; // 禁止访问

	public static final String IDF_SUPERADMINISTRATOR = "系统管理员";
	public static final String IDF_ADMINISTRATOR = "用户管理员";
	public static final String IDF_GENRALROLE = "普通用户";

	public static final String MSG_RECORD_NOT_EXITS = "记录不存在，可能已经被删除！";
	public static final String MSG_CODE_NOT_UNIQUE = "业务号不允许重复！";
	public static final String MSG_USER_VERITY = "验证码错误";
	public static final String MSG_USER_NOT_EXIST = "用户不存在！";
	public static final String MSG_USER_LOGIN_ERR = "用户密码错误！";
	public static final String MSG_USER_NOT_ACTIVE = "用户当前处于不可用状态！";
	public static final String MSG_USER_LOCK = "用户被系统锁定！";
	public static final String MSG_USERNAME_NOT_UNIQUE = "该用户名已经被使用！";
	public static final String MSG_USERNAME_IS_NULL = "用户名不允许为空！";
	public static final String MSG_PASSWORD_IS_NULL = "用户密码不允许为空！";
	public static final String MSG_STATUS_IS_NULL = "用户状态不允许为空！";
	public static final String MSG_MODULENAME_IS_NULL = "模块名称不允许为空！";
	public static final String MSG_PARENTID_IS_NULL = "父节点不允许为空！";
	public static final String MSG_PARENT_IS_MISS = "父节点不存在，可能已经被删除！";
	public static final String MSG_SYS_BINDEX_IS_NULL = "显示顺序不允许为空！";
	public static final String MSG_ORGNAME_IS_NULL = "组织结构的名称不能为空！";
	public static final String MSG_ORG_NAME_IS_EXIST = "下面已经存在同名的机构！";
	public static final String MSG_ORG_STARTYEAR_WRONG = "起始年度的格式不对！";
	public static final String MSG_ORG_ENDYEAR_WRONG = "失效年度的格式不对！";
	public static final String MSG_ORG_START_END_COMPARE = "起始年份不应该比失效年份大！";
	public static final String MSG_ORG_START_EXCEED = "起始年份不在上级单位的起止年份内！";
	public static final String MSG_ORG_END_EXCEED = "失效年份不在上级单位的起止年份内！";
	
	public static final String MSG_SYS_PROPERTY_IS_NULL = "模块类型不允许为空！";
	public static final String MSG_ADMIN_CANNOT_DELETE = "系统管理员不允许删除！";
	public static final String MSG_ROLENAME_IS_NULL = "角色名称不允许为空！";
	public static final String MSG_ROLENAME_NOT_UNIQUE = "该角色名称已经被使用！";
	public static final String MSG_ROLE_HAS_USERS = "该角色下包含有用户，不能够删除！";
	public static final String MSG_USER_OLDPWD_WRONG = "用户旧口令输入不正确！";
	public static final String MSG_POSNAME_IS_NULL = "岗位名称不允许为空！";
	public static final String MSG_POSNAME_NOT_UNIQUE = "该岗位名称已经被使用！";
	public static final String MSG_POSI_HAS_CHILD = "已有组织机构关联了该岗位，不能够删除！";
	public static final String MSG_ROCK_POWER_USER_EXIST = "常用操作已存在！";

	public static final String MSG_TEMPLATE_TYPE_ISNULL = "模板类型不允许为空！";
	public static final String MSG_TEMPLATE_DATE_ISTNULL = "时间不允许为空！";
	public static final String MSG_TEMPLATE_DATE_STYLE_ERR = "时间格式不匹配！";
	public static final String MSG_TEMPLATE_DATE_CORRECT = "正确的格式为YYYYMM或YYYY";
	public static final String MSG_TEMPLATE_IS_EXIST = "该组织机构下已存在相同的模板";
	public static final String MSG_TEMPLATE_MODEL_ISTNULL = "模板编号不允许为空！";
	public static final String MSG_TEMPLATE_ZB_ISTNULL = "指标编号不允许为空！";
	public static final String MSG_TEMPLATE_JLDW_ISTNULL = "计量单位不允许为空！";
	public static final String MSG_TEMPLATE_ZBNAME_ISTNULL = "指标名称不允许为空！";
	public static final String MSG_TEMPLATE_ZBSHEETNAME_ISTNULL = "表单显示名称不允许为空！";
	public static final String MSG_TEMPLATE_GUIDELINE_IS_EXIST = "模板中已存在相同的指标";
	
	public static final String MSG_GUIDELILNE_FORMULA_TYPE = "已经存在相同分类的公式！";
	/*
	 * 指标管理
	 */
	public static final String GUIDELINE_PACKAGE = "com.sgepit.lab.ocean.guideline.hbm.";
	public static final String GUIDELINE_INFO = "SgccGuidelineInfo";
	
}
