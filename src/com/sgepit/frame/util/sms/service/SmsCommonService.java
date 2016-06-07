package com.sgepit.frame.util.sms.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.flow.hbm.PopMspTime;
import com.sgepit.frame.flow.hbm.TaskView;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.frame.util.sms.dao.PopMspDAO;
import com.sgepit.frame.util.sms.vo.PopMsp;

public class SmsCommonService  implements SmsCommonServiceFacade{
	private static final Log log = LogFactory.getLog(SmsCommonService.class);
	
	//注入DAO
	private PopMspDAO popMspDAO;
	public static SmsCommonService getFromApplicationContext(ApplicationContext ctx) {
		return (SmsCommonService) ctx.getBean("smsCommonService");
	}	
	public PopMspDAO getPopMspDAO() {
		return popMspDAO;
	}
	public void setPopMspDAO(PopMspDAO popMspDAO) {
		this.popMspDAO = popMspDAO;
	}
	
	private SendMessageFacade sendMessage;
	
	public void sendSms(){
		try {
//			InputStream is = this.getClass().getResourceAsStream("/sendmessage_sgcc.properties");
//			Properties props = new Properties();
//			props.load(is);
//			String isSendMessage = props.getProperty("IS_SENDMESSAGE");  // 是否需要发送短信
//			is.close();

			//增加了手动设值是否开启流程短信发送的功能,不再从属性文件读取，直接查询PopMspTime表	pengy 2013-10-24
			List<PopMspTime> usingScheme = this.popMspDAO.findByWhere(PopMspTime.class.getName(), "isOpen = '1'");
//			if(isSendMessage.equals("true")){
			if(usingScheme != null && usingScheme.size() > 0){
				String schemeTime = usingScheme.get(0).getSchemTime();
				Date date = new Date();
				SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm");
				String minu = dateFormat.format(date).toString();
				//小时和分钟的第一位相同即可执行发送短信  pengy 2013-10-28
				if (schemeTime.substring(0, schemeTime.length() - 2).equals(minu.substring(0, minu.length() - 2))){
					updateFlowTaskPopMsp();
					ArrayList noSendMsgList = (ArrayList) popMspDAO.findByWhere(PopMsp.class.getName(), "msgState=0");
					log.info("查询是否有没发出的短信："+noSendMsgList.size());
					// 没有未发送的短信， 即短信已全部发送完毕
					if(noSendMsgList.size() == 0){
						log.info("没有未发送的短信.......");
					}else{
						// 如果有未发送的短信，则将未发送的短信全部发送出去
						
						// 确定要执行发送短信提醒功能
							this.sendMessage.doIt(noSendMsgList);
					}
				}
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
		}
	}
	public SendMessageFacade getSendMessage() {
		return sendMessage;
	}
	public void setSendMessage(SendMessageFacade sendMessage) {
		this.sendMessage = sendMessage;
	}
	
	/**
	 * 在发送短息任务之前，获取流程待办事项中未处理的内容，写入短信队列表中
	 * @author: Liuay
	 * @createDate: 2011-12-22
	 */
	private void updateFlowTaskPopMsp(){
		log.info("清理流程待办事项部分的短信列表...");
		List<PopMsp> flwToSendList = popMspDAO.findByWhere(PopMsp.class.getName(), "msgState=0 and module_name='FLOW'");
		if (flwToSendList.size()>0) {
			popMspDAO.deleteAll(flwToSendList);
			
			log.info("清理流程待办事项【" + flwToSendList.size() + "】条过时信息...");
		}
		
		log.info("获取流程待办事项的内容...");
		List<TaskView> flwTodoList = popMspDAO.findByWhere(TaskView.class.getName(), "flag='0'");
		doSend(flwTodoList, "1");
	}

	/**
	 * 将通用的拼接短信内容,并存入短信队列的功能抽取出来
	 * @param flwTodoList TaskView对象的集合
	 * @param flag 0 表示即时短信，1 表示定时短信
	 * @author pengy 2013-10-25
	 * @return 短信队列的集合
	 */
	private ArrayList<PopMsp> doSend(List<TaskView> flwTodoList, String flag){
		ArrayList<PopMsp> popMsps = new ArrayList<PopMsp>();
		for (int k = 0; k < flwTodoList.size(); k++) {
			TaskView taskView = (TaskView) flwTodoList.get(k);
			String toUserId = taskView.getTonode();
	    	if (toUserId!=null && toUserId.length()>0) {
				RockUser toUser = (RockUser) this.popMspDAO.findById(RockUser.class.getName(), toUserId);
				if (toUser!=null && toUser.getMobile()!=null && toUser.getMobile().trim().length()>0
						&& toUser.getReceiveSMS()!=null && toUser.getReceiveSMS().trim().equals("1")
						) {
					PopMsp popMsp = new PopMsp();
					popMsp.setLsh(SnUtil.getNewID());
					popMsp.setMsgState(0L);
					popMsp.setRecieveName(toUser.getMobile().trim());
					
					String msg = "您好，" + taskView.getFlowtitle() + "有一条待办事项需要您处理:";
					msg += "\n流程类型： " + taskView.getFlowtitle();
					msg += "\n主题： " + taskView.getTitle();
					msg += "\n发送人： " + taskView.getFromname();
					msg += "\n发送时间： " + (new SimpleDateFormat("yyyy-MM-dd kk:mm:ss")).format(taskView.getFtime());
					msg += "\n请登录MIS系统处理，如不能亲自处理，请找人代办完成。";
					msg += "\n【MIS待办事项提醒】";
					popMsp.setSendNote(msg);
					
					popMsp.setModuleName("FLOW");
					//由于流程下一步时发送短信耗时太久，改为只添加到短信队列，然后从页面异步调用发短信功能 pengy 2013-11-15
//					if (flag.equals("0")){//如果是即时短信，则发送短信
//						this.sendMessage.sendASms(msg, toUser.getMobile().trim());
//					}
					this.popMspDAO.saveOrUpdate(popMsp);
					popMsps.add(popMsp);
				}
			}
		}
		return popMsps;
	}

	/**
	 * 判断流程发送后是否发送短信
	 * @param flwTasks	需要发送短信的流程任务
	 * @author pengy 2013-10-25
	 */
	public void isSendMsgNow(List<TaskView> flwTasks){
		//查询已启用的，使用中的短信发送时间计划
		List<PopMspTime> usingScheme = this.popMspDAO.findByWhere(PopMspTime.class.getName(), "isUsing = '1' and isOpen = '1'");
		if (usingScheme != null && usingScheme.size()>0){
			PopMspTime popMspTime = usingScheme.get(0);
			//即时短信开始时间
			String begin = popMspTime.getBeginTime();
			int beginHour = new Integer(begin.substring(0, begin.length() - 3));
			int beginMinu = new Integer(begin.substring(begin.length() - 2));
			//小时转为分钟
			int beginMinuTotal = beginHour * 60 + beginMinu;
			//即时短信结束时间
			String end = popMspTime.getEndTime();
			int endHour = new Integer(end.substring(0, end.length() - 3));
			int endMinu = new Integer(end.substring(end.length() - 2));
			//小时转为分钟
			int endMinuTotal = endHour * 60 + endMinu;
			//周末是否发送
			String isWeekendSend = popMspTime.getIsWeekendSend();
			
			Date date = new Date();
			Calendar cal = Calendar.getInstance();
			cal.setTime(date);
			//1为Sunday，7为Saturday
			int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
			//isWeekendSend为0，周末不发短信
			if (isWeekendSend.equals('0') && (dayOfWeek == 1 || dayOfWeek == 7)){
				 return;
			}
			SimpleDateFormat hourFormat = new SimpleDateFormat("HH");
			SimpleDateFormat minuFormat = new SimpleDateFormat("mm");
			int hour = new Integer(hourFormat.format(date).toString());
			int minu = new Integer(minuFormat.format(date).toString());
			//小时转为分钟
			int minuTotal = hour * 60 + minu;
			if (minuTotal > beginMinuTotal && minuTotal < endMinuTotal){
				ArrayList popMsps = doSend(flwTasks, "0");
				if (popMsps != null && popMsps.size()>0){
					this.sendMessage.doIt(popMsps);
				}
			}
		}
	}
}
