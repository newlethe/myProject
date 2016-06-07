package com.sgepit.pcmis.dynamicview.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONObject;

import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.PersistentClass;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import com.sgepit.frame.base.Constant;

/*定义动态数据各子系统URL*/
public class DynamicDataUtil {
//项目基本信息
public static final String PROJECT_INFO_URL=
							"PCBusiness/zhxx/baseInfoInput/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp";
//主要合作单位URL
public static final String PROJECT_PARTNER_URL="PCBusiness/zhxx/query/pc.zhxx.projinfo.coUnit.jsp";
//项目组织机构
//public static final String PROJECT_UNITSTRUCTURE_URL="jsp/index/todo.jsp";
public static final String PROJECT_UNITSTRUCTURE_URL = "PCBusiness/zhxx/query/pc.zhxx.projinfo.unitStructure.jsp";
//主要事件
public static final String PROJECT_MAINTHING_URL="Business/fileAndPublish/fileManage/com.fileManage.query.jsp";


//批文信息
public static final String APPROVAL_URL="jsp/index/todo.jsp";


//招标申请
public static final String BID_APPLY_URL="PCBusiness/bid/pc.bid.zb.apply.input.jsp";
//招标进度
public static final String BID_SCHEDULE_URL="PCBusiness/bid/pc.bid.detail.mainFrame.jsp";
//招标（合同）月报
public static final String BID_REPORT_URL="PCBusiness/bid/pc.bid.input.superviseReport.jsp";


//合同信息
public static final String CON_OVE_URL="Business/contract/cont.main.frame.jsp";
//合同付款URL
public static final String CON_PAY_URL="Business/contract/cont.main.frame.jsp";
//合同变更
public static final String CON_CHANGE_URL="Business/contract/cont.main.frame.jsp";
//合同违约URL
public static final String CON_BRE_URL="Business/contract/cont.main.frame.jsp";
//合同索赔
public static final String CON_CLA_URL="Business/contract/cont.main.frame.jsp";
//合同结算
public static final String CON_BAL_URL="Business/contract/cont.main.frame.jsp";


//概算结构
public static final String BDG_INFO_URL="PCBusiness/dynamicdata/bdg/bdginfo_view.jsp";
//概算合同分摊
public static final String BDG_MONEYAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同付款分摊
public static final String BDG_PAYAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同变更分摊
public static final String BDG_CHANGEAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同违约分摊
public static final String BDG_BREAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同索赔分摊
public static final String BDG_CLAAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同结算分摊
public static final String BDG_BALAPP_URL="Business/budget/bdg.main.frame.jsp";
//概算合同工程量分摊
public static final String BDG_PROJECTAPP_URL="Business/budget/bdg.main.frame.jsp";


//安全事故
public static final String SECURITY_ACC_URL="PCBusiness/aqgk/baseInfoInput/pc.aqgk.accident.query.jsp";
//安全报告
public static final String SECURITY_REPORT_URL="PCBusiness/aqgk/baseInfoInput/pc.aqgk.safetymonth.query.jsp";
//安全培训
public static final String SECURITY_TRAIN_URL="PCBusiness/aqgk/baseInfoInput/pc.aqgk.safetyTrain.query.jsp";


//质量验评
public static final String QUALITY_ASS_URL="PCBusiness/zlgk/pc.zlgk.input.assessment.multi.jsp";
public static final String QUALITY_ASS_TITLE = "更新信息查询--验评信息";
//质量监理报告
public static final String QUALITY_SUPER_URL="PCBusiness/zlgk/pc.zlgk.input.supervison.jsp";
public static final String QUALITY_SUPER_TITLE = "更新信息查询--监理报告";


//进度进展
public static final String SCHEDULE_PROGRESS_URL="PCBusiness/jdgk/pc.jdgk.month.report.jsp";
public static final String SCHEDULE_PROGRESS_TITLE = "更新信息查询--进度情况月报";
//里程碑
public static final String SCHEDULE_LICHENGBEI_URL="PCBusiness/jdgk/pc.jdgk.project.jsp";
public static final String SCHEDULE_LICHENGBEI_TITLE = "更新信息查询--里程碑计划";
//一级网络计划
public static final String SCHEDULE_YIJIWANGLUO_URL="PCBusiness/jdgk/pc.jdgk.project.jsp";
public static final String SCHEDULE_YIJIWANGLUO_TITLE = "更新信息查询--一级网络计划";


//投资年度计划
public static final String INVEST_YEAR_URL="PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.yearInvest.jsp";
//投资月度完成
public static final String INVEST_MONTH_URL="PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.monthInvest.jsp";
//电源固定资产投资完成情况月报
public static final String INVEST_MONTH_TZWC_URL="/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.report.jsp";
//电源建设规模和新增生产能力月报
public static final String INVEST_MONTH_SCNL_URL="/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport2.report.jsp";
//电源固定资产本年资金到位情况
public static final String INVEST_MONTH_ZJDW_URL="/PCBusiness/tzgl/DYReport/pc.tzgl.DYReport3.report.jsp";

//月报综合查询页面
public static final String ALL_MONTHLY_REPORT_URL = "PCBusiness/dynamicdata/pc.all.monthly.report.query.jsp";

public static final String OP_ADD="add";
public static final String OP_UPDATE="update";
public static final String OP_DELETE="delete";
private static Configuration  cfg;

private DynamicDataUtil(){
	
}
/**
 * @author alex
 * @param tabelName 传入的EntryBean 的class路径
 * @return  返回该class文件对应的数据库表
 */
public static String  getTableNameByEntry(String tabelName){
	 if(cfg==null){
		 LocalSessionFactoryBean lsfb = (LocalSessionFactoryBean)Constant.wact.getBean("&sessionFactory1");
		 cfg=lsfb.getConfiguration();
	 }
	 PersistentClass pc = cfg.getClassMapping(tabelName);
	 if(pc==null)
		 throw new RuntimeException("没有找到对应的映射文件!");
	 String tableName = pc.getTable().getName();
	 return tableName;
}
@SuppressWarnings("unchecked")
public static List changeisLeaf(List list, String str) {
	if(str==null||"".equals(str)){
		throw new RuntimeException("子节点属性必须指定");
	}else {
		String temp =str.substring(0, 1);
		String temp2 =str.substring(1);
		String ref ="get"+temp.toUpperCase()+temp2;
		List newList = new ArrayList();
		for (int i = 0; i < list.size(); i++) {
			boolean flag = false;
			Object obj = list.get(i);
			try {
				Method method = obj.getClass().getDeclaredMethod(ref, new Class[]{});
				long res = (Long) method.invoke(obj, new Object[]{});
				if (res > 0) {
					flag = true;
				}
			} catch (Exception e) {
				throw new RuntimeException("没有找到指定的方法");
			}
			JSONObject json = JSONObject.fromObject(obj);
			if(flag){
				json.put("iconCls", "cog");
				json.put("leaf",flag);
			}else {
				json.put("iconCls", "ux-test");
				json.put("leaf",flag);
			}
			newList.add(json);
		}
		return newList;
	}

}
}
