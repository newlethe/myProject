package com.sgepit.pmis.common;

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
	public static Map ENTITYBEANS;

	public static final String MSG_PID_IS_NULL = "工程项目编号不允许为空！";
	public static final String MSG_CON_ID_IS_NULL = "合同号不允许为空！";
	public static final String MSG_CON_NAME_IS_NULL = "合同名称不允许为空！";
	public static final String MSG_BREID_IS_NOT_NULL = "违约号不允许为空！";
	public static final String MSG_BREWORK_IS_NOT_NULL = "违约处理情况不允许为空！";
	public static final String MSG_CHANGENO_IS_NOT_NULL = "序号不允许为空！";
	public static final String MSG_PAYNO_IS_NOT_NULL = "支付编号不允许为空！";
	public static final String MSG_CON_IS_NOT_EXIST = "合同不存在！";
	public static final String MSG_CON_IS_NOT_UNIQUEE = "数据已存在！";

	/*
	 * 合同管理部分
	 */
	public static final String CON_PACKAGE = "com.sgepit.pmis.contract.hbm.";
	public static final String CON_OVE = "ConOve";
	public static final String CON_BRE = "ConBre";
	public static final String CON_CHA = "ConCha";
	public static final String CON_PAY = "ConPay"; 
	public static final String CON_EXP = "ConExp";
	public static final String CON_BAL = "ConBal";
	public static final String CON_CLA = "ConCla";
	public static final String CON_EXPKID = "ConExpkid";
	public static final String CON_PARTYB = "ConPartyb";
	public static final String CON_ACCINFO = "ConAccinfo";
	public static final String CON_COMPLETION = "ConCompletion";
	public static final String CON_COMPLETION_SUB = "ConCompletionSub";
	
    /*  
	 * 建设法人投资完成
     */
	public static final String ConInv_PACKAGE = "com.sgepit.pmis.coninvested.hbm.";
	public static final String corp_invested="CorpCompletion";
	public static final String Sub_CorpInvested="CorpCompletionSub";
	
	/*
	 * 计划管理部分
	 */
    public static final String BDG_PACKAGE = "com.sgepit.pmis.budget.hbm.";
	public static final String BDG_INFO = "BdgInfo";			//概算结构维护
	public static final String BDG_PAY_APP = "BdgPayApp";		//合同付款结算
	public static final String BDG_MONEY_APP = "BdgMoneyApp";    // 合同金额概算
	public static final String BDG_COMPENSATE_APP = "BdgClaApp";   //合同索赔概算
	public static final String BDG_BREACH_APP = "BdgBreachApp";	
	public static final String BDG_CHANG_APP = "BdgChangApp";
	public static final String BDG_CHANGE_APP = "BdgChangApp";
	public static final String BDG_MONEY_APP_EXT = "BdgMoneyAppExt";
	public static final String BDG_BALANCE_APP = "BdgBalApp"; // 合同违约分摊
	public static final String BDG_PROJECT = "BdgProject";
	public static final String COMP_OTHER = "OtherCompletion"; // 其他费用投资完成
	public static final String COMP_OTHER_SUB = "OtherCompletionSub";
	public static final String PRO_ACM_INFO = "ProAcmInfo"; // 工程量投资完成
	public static final String PRO_ACM_TREE = "ProAcmTree";
	public static final String PRO_ACM_MONTH = "ProAcmMonth";
	public static final String V_BDG_LIBRARY = "VBdgLibrary";//概算库
	public static final String BDG_CORP_BASIC = "BdgCorpBasic";
    public static final String BDG_CORP_INFO = "BdgCorpInfo";
    public static final String BDG_MONEY_PLAN_SUB = "BdgMoneyPlanSub";
    public static final String BDG_MONEY_PLAN_MAIN = "BdgMoneyPlanMain";
    
    	/*
	 * 内控概算增加部分
	 */
	public static final String BDGNK_PACKAGE = "com.sgepit.pmis.budgetNk.hbm.";
	public static final String BDGNK_ENTITY = "BudgetNk";
	public static final String BDGNK_MONEY_APP_ENTITY = "BudgetMoneyAppNk";
	public static final String BDGNK_CHANGE_APP_ENTITY = "BudgetChangeAppNk";
	public static final String BDGNK_PAY_APP_ENTITY = "BudgetPayAppNk";
	public static final String BDGNK_CLA_APP_ENTITY = "BudgetClaAppNk";
	public static final String BDGNK_BREAK_APP_ENTITY = "BudgetBreakAppNk";
	
    //概算结构 - 各部分跟节点id
    public static final String BDG_BUILD_ROOT_ID = "0101";	// 建筑
    public static final String BDG_INSTALL_ROOT_ID = "0102";	// 安装
    public static final String BDG_EQUIP_ROOT_ID = "0103";		// 设备
    public static final String BDG_OTHER_ROOT_ID = "0104";		// 其它

	/*
	 * 招投标管理
	 * 
	 */
	public static final String Tend_PACKAGE = "com.sgepit.pmis.tenders.hbm.";
	public static final String Tend_PBASIC = "Pbasic";
	public static final String Tend_ZBBASIC = "ZbBasic";
	public static final String Tend_ZBJH = "ZbJh";
	public static final String Tend_PW = "ZbPw";
	public static final String Tend_ZBRCK = "ZbRck";
	public static final String Tend_ZBTBDW = "ZbTbdw";
	public static final String Tend_ZBWYH = "ZbWyh";
	
	public static final String Ten_ABI = "TenAbi";
	public static final String Ten_COM = "TenCom";
	public static final String Ten_PRO = "TenPro";
	public static final String Ten_REG = "TenReg";
	public static final String Ten_SUB = "TenSub";
	public static final String Ten_UNI = "TenUni";
	
	public static final String MSG_TendPro_ID_IS_NULL = "项目编号不允许为空！";
	public static final String MSG_TendPro_Name_IS_NULL = "项目名称不允许为空！";
	public static final String MSG_TendPro_IS_NOT_UNIQUEE = "招标项目不允许重复！";
	public static final String MSG_TendPro_Mind_IS_NULL = "项目评标意见不允许为空！";
	public static final String MSG_TendPro_TenMoney_IS_NULL = "项目标底金额不允许为空！";
	public static final String MSG_TendPro_TenMode_IS_NULL = "项目招标方式不允许为空！";
	public static final String MSG_TendPro_TenSendDate_IS_NULL = "发标日期不允许为空！";
	public static final String MSG_TendPro_TenOpenDate_IS_NULL = "开标日期不允许为空！";


	/*
	 * 标段
	 */

	public static final String MSG_TendSub_TenSubName_IS_NULL = "标段名称不允许为空！";

	public static final String MSG_TendSub_TenSubNo_IS_NULL = "标段编码不允许为空！";
	public static final String MSG_TendSub_IS_NOT_UNIQUEE = "标段不允许重复！";
	
	public static final String MSG_TendSub_TenInputDate_IS_NULL = "标段时间不允许为空！";
	public static final String MSG_TendSub_TenMoney_IS_NULL = "标段金额不允许为空！";

	/*
	 * 资料分类管理
	 */
	public static final String Zl_PACKAGE = "com.sgepit.pmis.INFManage.hbm.";
	public static final String Inf_Sort = "INFSORT";
	public static final String Inf_DAML = "INFDAML";
	public static final String Inf_EleArc = "InfEleArc";
	public static final String TREE_INF_SORT = "InfSortTree";
	public static final String MSG_INF_WJBH_IS_NULL = "文件编号不允许为空！";
	public static final String MSG_INF_Wjcltm_IS_NULL = "文件标题不允许为空！";
	public static final String MSG_INF_rq_IS_NULL = "日期不允许为空！";
	public static final String MSG_INF_WJSl_IS_NULL = "文件份数！";
	public static final String MSG_INF_IS_NOT_UNIQUEE = "文件编号已存在！";
	/*
	 * 设备管理
	 */
	public static final String EQU_PACKAGE = "com.sgepit.pmis.equipment.hbm.";
	public static final String EQU_INFO = "EquInfo";
	public static final String EQU_INFO_PART = "EquInfoPart";
	public static final String EQU_GET_GOODS = "EquGetGoods";
	public static final String EQU_TK_GOODS = "EquTkGoods";
	public static final String EQU_OPEN_BOX = "EquOpenBox";
	public static final String EQU_HOUSEOUT = "EquHouseout"; // 设备出库子表
	public static final String EQU_HOUSEOUT_SUB = "EquHouseoutSub"; // 设备出库子表
	public static final String EQU_INFO_GET = "EquInfoGet";
	public static final String EQU_INFO_PART_GET = "EquInfoPartGet";
	public static final String EQU_REC = "EquRec";
	public static final String EQU_REC_SUB = "EquRecSub";
	public static final String ACM_PRO_COMPLETION = "ProCompletion"; // 
	public static final String ACM_PRO_COMPLETION_SUB = "ProCompletionSub";
	public static final String EQU_GET_GOODS_SUB = "EquGetGoodsSub";
	public static final String EQU_LIST = "EquList";
	public static final String EQU_DH = "EquSbdh";
	public static final String EQU_DH_ARR = "EquSbdhArr";
	public static final String EQU_GET_GOODS_ARR = "EquGetGoodsArr";
	public static final String EQU_OPEN_BOX_SUB = "EquOpenBoxSub";
	
	public static final String EQU_SB_SETUP = "EquSbaz";
	
	/**
	 * 材料管理
	 */
	public static final String MAT_PACKAGE = "com.sgepit.pmis.material.hbm.";
	public static final String MAT_FRAME = "MatFrame"; // 设备结构维护
	public static final String MAT_FRAME_CONTRCAT = "MatFrameContract"; // 合同材料
	public static final String MAT_CODE_APPLY = "MatCodeApply"; // 材料申请
	public static final String MAT_APPBUY_BUY = "MatAppbuyBuy";
	public static final String MAT_APPBUY_APP = "MatAppbuyApply";
	public static final String MAT_APPBUY_FORM = "MatAppbuyForm";
	public static final String MAT_APPBUY_MATERIAL = "MatAppbuyMaterial";
	public static final String MAT_GOODS_CHECK = "MatGoodsCheck";
	public static final String MAT_GOODS_CHECKSUB = "MatGoodsChecksub";
	public static final String MAT_GOODS_INVOICE = "MatGoodsInvoice";
	public static final String MAT_GOODS_INVOICESUB = "MatGoodsInvoicesub";
	public static final String MAT__STORE_IN = "MatStoreIn";
	public static final String MAT__STORES_INSUB = "MatStoreInsub";
	public static final String MAT__STORES_OUTAPPVIEW = "MatAppView";
	public static final String MAT__STORES_OUTSUBVIEW = "MatStoreoutView";
	public static final String MAT__STORES_OUT = "MatStoreOut";
	public static final String MAT__STORES_OUTSUB = "MatStoreOutsub";
	
	
	public static final String ADJUNCT_PACKAGE = "com.hdkj.webpmis.domain.adjunct.";
	public static final String TREE_INFO = "TreeInfo";
	
	/*
	 * 
	 * 安全施工管理
	 */
	public static final String SAFE_PACKAGE ="com.sgepit.pmis.tenders.hbm.";
	public static final String SAFE_SORT="SafSort";//安全施工分类
	public static final String SAFE_SORT_INTI="SafetySortIniti";
	public static final String SAFE_JOBEXA="SafetyJobExamine";
	public static final String SAFE_JOBEXA_LIST="SafetyJobExamineList";
	
	public static final String TREE_PACKAGE= "com.hdkj.webpmis.domain.treeinfo.";
	
	/*
	 * 
	 * 流程管理
	 */
	public static final String FLOW_PACKAGE = "com.sgepit.frame.flow.hbm.";
	public static final String FLOW_DEFINITION = "FlwDefinition";
	public static final String FLOW_INSTANCE = "FlwInstance";
	public static final String FLOW_LOG = "FlwLog";
	public static final String FLOW_NODE = "FlwNode";
	public static final String FLOW_NODE_VIEW = "FlwNodeView";
	public static final String FLOW_NODE_PATH = "FlwNodePath";
	public static final String FLOW_NODE_PATH_VIEW = "FlwNodePathView";
	public static final String FLOW_FRAME = "FlwFrame";
	public static final String FLOW_FILES = "FlwFiles";
	public static final String FLOW_FILES_INS = "FlwFilesIns";
	public static final String FLOW_FACE = "FlwFace";
	public static final String FLOW_FACE_PARAMS = "FlwFaceParams";
	public static final String FLOW_FACE_PARAMS_INS = "FlwFaceParamsIns";
	public static final String FLOW_ADJUNCT_INS = "FlwAdjunctIns";
	public static final String FLOW_COMMON_NODE = "FlwCommonNode";
	public static final String FLOW_COMMON_NODE_PATH = "FlwCommonNodePath";
	public static final String FLOW_COMMON_NODE_PATH_INS = "FlwCommonNodePathIns";
	public static final String FLOW_COMMON_CURRENT_NODE_INS = "FlwCommonCurrentNodeIns";
	public static final String INS_DATA_INFO_VIEW = "InsDataInfoView";
	
	/*
	 * 新资料管理
	 */
	public static final String Zlgl_PACKAGE = "com.sgepit.pmis.document.hbm.";
	public static final String ZL_ZlTree = "ZlTree";
	public static final String DA_Tree = "DaTree";
	public static final String DA_Zl = "DaZl";
	public static final String DA_Daml = "DaDaml";
	

	/*
	 * 工程技术管理
	 */
	public static final String Gcjs_PACKAGE = "com.hdkj.webpmis.domain.gcjs.";
	public static final String GCJS_Tree = "GcjsTree";
	public static final String GCJS_info = "GcjsInfo";
	
	/**
	 * 工程文件管理
	 */
	public static final String PRO_PACKAGE = "com.hdkj.webpmis.domain.project.";
	public static final String PRO_SORT = "ProSort";
	public static final String PRO_FILE = "ProFile";
	
	/**
	 * 财务管理
	 */
	public static final String FIN_PACKAGE = "com.sgepit.pmis.finance.hbm.";
	public static final String FIN_SORT = "FinAssetSort";
	public static final String FIN_AUDIT_INSTALL = "FinAuditInstall";  
	public static final String FIN_SUBJECT_SORT = "FinSubjectSort";  
	public static final String FIN_AUDIT_STOREOUT = "FinAuditStoreout";  
	public static final String FIN_AUDIT_BUILD =  "FinAuditBuild";
	
	/*
	 * yuw
	 * */
	public static String APPBudgetRootID = "root";
	
	/*
	 * 综合管理
	 *制度文件
	 */
	public static final String Zd_PACKAGE = "com.sgepit.pmis.routine.hbm.";
	public static final String ZD_Tree = "ZdTree";
	public static final String ZD_Gl = "ZdGl";
	
	/*
	 * 招标文件管理
	 */
	public static final String Zbwj_PACKAGE = "com.sgepit.pmis.routine.hbm.";
	public static final String Zbwj_Tree = "ZbwjTree";
	public static final String Zbwj_Gl = "ZbwjGl";
	/*
	 * 设计资料管理
	 */
	public static final String DesInfo_PACKAGE = "com.sgepit.pmis.design.hbm.";
	public static final String DesignInfo_Tree = "DesignInfoTree";
	public static final String DesignInfo_Gl = "DesignInfoGl";
	
	/*
	 * 竣工决算
	 */
	//工程概况信息
	public static final String PRJ_GENERAL_INFO_PKG = "com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.";
	public static final String PRJ_INFO_PARAMS = "FAPrjParams";
	public static final String PRJ_INFO_OVE = "FAPrjInfoOve";
	public static final String PRJ_INFO_PROGRESS = "FAPrjInfoProgress";
	public static final String PRJ_EQU = "FAPrjEqu";
	public static final String PRJ_INVESMENT = "FAPrjInvesment";
	
	//竣建概算结构
	public static final String FA_GC_TYPE_ROOT_ID = "0";
	public static final String FA_BDG_ROOT_ID = "0";
	public static final String FA_BDG_STRUC_PKG = "com.sgepit.pmis.finalAccounts.bdgStructure.hbm.";
	public static final String FA_GC_TYPE = "FAGcType";
	public static final String FA_BDG_INFO = "FABdgInfo";
	
	
}
