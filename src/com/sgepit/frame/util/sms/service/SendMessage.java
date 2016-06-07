package com.sgepit.frame.util.sms.service;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.smslib.GatewayException;
import org.smslib.IInboundMessageNotification;
import org.smslib.IOutboundMessageNotification;
import org.smslib.InboundMessage;
import org.smslib.OutboundMessage;
import org.smslib.SMSLibException;
import org.smslib.Service;
import org.smslib.TimeoutException;
import org.smslib.InboundMessage.MessageClasses;
import org.smslib.Message.MessageEncodings;
import org.smslib.Message.MessageTypes;
import org.smslib.OutboundMessage.MessageStatuses;
import org.smslib.Service.ServiceStatus;
import org.smslib.modem.SerialModemGateway;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.util.sms.dao.PopMspDAO;
import com.sgepit.frame.util.sms.vo.PopMsp;

public class SendMessage implements  SendMessageFacade{
	private static final Log log = LogFactory.getLog(SendMessage.class);
	
	//注入DAO
	private PopMspDAO popMspDAO;
	
	public static SendMessage getFromApplicationContext(ApplicationContext ctx) {
		return (SendMessage) ctx.getBean("sendMessage");
	}	
	public PopMspDAO getPopMspDAO() {
		return popMspDAO;
	}
	public void setPopMspDAO(PopMspDAO popMspDAO) {
		this.popMspDAO = popMspDAO;
	}
	
	private static Service messageService; 

	// 发送短信
	public void doIt(ArrayList msgList)  {
		log.info("正在发送短信了........");
		try{
			int successFlag = 0;  // 记录成功发送短信的条数

			if(!checkServiceStatus()) {
				this.startService("properties");
			}
			
			for(int i=0;i<msgList.size();i++){		
				PopMsp popMsp = (PopMsp) msgList.get(i);
				String sendStatus = this.sendOut(popMsp.getSendNote(), popMsp.getRecieveName());
				
				// 如果消息发送成功
				if(sendStatus.equalsIgnoreCase(MessageStatuses.SENT.toString())){
					// 发送成功， 则修改消息的状态和发送时间
					boolean flag = this.updateMsgState(popMsp.getLsh());
					if(flag){
						// 记录成功发送消息的条数
						successFlag ++;
					}
				}
			} 
			log.info("**************************短信发送( "+successFlag+" 条短信)完毕***************************");
		}catch(Exception e){
			log.error("发送短信出现异常，请检查设备及其连接状态....");
			log.error(e.getMessage());
			e.printStackTrace();
		}finally{
			try {
				this.stopService();
			} catch (TimeoutException e) {
				e.printStackTrace();
			} catch (GatewayException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (NullPointerException e) {
				//测试出startService失败，再进行stopService时，报空指针异常 pengy 2013-11-06
				e.printStackTrace();
			} catch (Exception e){
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 开放只发送一条短信接口
	 * @param content	短信内容
	 * @param mobile	接收号码
	 * @author: Liuay
	 * @createDate: 2012-7-19
	 */
	public void sendASms(String content, String mobile) {
		log.info("向" + mobile + "发送短消息........");
		try{

			if(!checkServiceStatus()) {
				this.startService("properties");
			}
			
			String sendStatus = this.sendOut(content, mobile);
			
			log.info("向" + mobile + "发送短消息成功。");
		}catch(Exception e){
			log.error("发送短信出现异常，请检查设备及其连接状态....");
			log.error(e.getMessage());
			e.printStackTrace();
		}finally{
			try {
				this.stopService();
			} catch (TimeoutException e) {
				e.printStackTrace();
			} catch (GatewayException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (NullPointerException e) {
				//测试出startService失败，再进行stopService时，报空指针异常 pengy 2013-11-06
				e.printStackTrace();
			} catch (Exception e){
				e.printStackTrace();
			}
		}
	}
	
	// 根据消息是否发送成功来修改对应消息的状态 
	public boolean updateMsgState(String lsh){
		boolean flag = true;
		try {
			// 如果成功发送休息的话， 则修改消息状态为 1 表示成功发送消息.
			PopMsp popMsp = (PopMsp) this.popMspDAO.findById(PopMsp.class.getName(), lsh);
			if(popMsp!=null) {
				popMsp.setMsgState(new Long(1));
				popMsp.setSendTime(this.transToDate(new Date()+""));
				popMspDAO.saveOrUpdate(popMsp);
			}
		} catch (Exception e) {
			e.printStackTrace();
			flag = false;
		}finally{
			return flag;
		}
	}
	
	// 时间转换格式
    private Date transToDate(String s) {
    	Date date = null;
    	if (s != null) {
    		SimpleDateFormat sdf = new SimpleDateFormat();
    		if (s.indexOf(" ") != -1) {
    			sdf.applyPattern("yyyy-MM-dd HH:mm:ss");
    			try {
					date = sdf.parse(s);
				} catch (ParseException e) {
					sdf.applyPattern("yyyy.MM.dd HH:mm:ss");
					try {
						date = sdf.parse(s);
					} catch (ParseException e1) {
					}
				}
    		} else {
    			sdf.applyPattern("yyyy-MM-dd");
    			try {
					date = sdf.parse(s);
				} catch (ParseException e) {
					sdf.applyPattern("yyyy.MM.dd");
					try {
						date = sdf.parse(s);
					} catch (ParseException e1) {
					}
				}
    		}
    	}
    	return date;
    }
	
/*************************************************************************************************************************/    
    //检查服务是否启动
    private boolean checkServiceStatus() {
		if(messageService!=null){
			log.info("messageService.getSettings() "+messageService.getSettings());
			log.info("messageService.getServiceStatus() "+messageService.getServiceStatus());
			return messageService.getServiceStatus().toString().equalsIgnoreCase(ServiceStatus.STARTED.toString());
		}else{
			log.info("The sms service has not init yet!!!");
			return false;
		}
	}

    //启动服务 
	private void startService(String initPropertyReadForm) throws TimeoutException, SMSLibException, IOException, InterruptedException {
    	log.info("initMessageService begin");
    	this.initMessageService(initPropertyReadForm);
    	log.info("initMessageService end");
    	log.info("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	
	//停止服务
	private void stopService() throws TimeoutException, GatewayException, IOException, InterruptedException {
		log.info("stopService begin");
		messageService.stopService();
		log.info("stopService end");
		log.info("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	
	private void readMessage() throws TimeoutException, GatewayException, IOException, InterruptedException {
		log.info("messageService.getServiceStatus() "+messageService.getServiceStatus());
    	log.info("readMsg() begin");
    	this.readMsg();
    	log.info("readMsg() end");
    	log.info("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	
	private void initMessageService(String initPropertyReadForm) throws TimeoutException, SMSLibException, IOException, InterruptedException {
		initMessageService(initPropertyReadForm,"modem.com1","COM1",9600,"wavecom",null);
	}
	
	private void initMessageService(String initPropertyReadForm,String gatewayid,String comport,int baudrate,String manufacturer,String model) throws TimeoutException, SMSLibException, IOException, InterruptedException {
		//默认值
		String GATEWAYID = "modem.com1";
		String COMPORT = "COM1";
		int BAUDRATE = 9600;
		String MANUFACTURER = "wavecom";
		String MODEL = null;
		initPropertyReadForm = initPropertyReadForm!=null&&initPropertyReadForm.equalsIgnoreCase("properties")?initPropertyReadForm:"parameter";
		if(initPropertyReadForm.equalsIgnoreCase("properties")){
			//读取短信猫配置文件
			try{
				InputStream is = this.getClass().getResourceAsStream("/sendmessage_sgcc.properties");
				Properties props = new Properties();
				props.load(is);
				GATEWAYID = props.getProperty("GATEWAYID");
				COMPORT = props.getProperty("COMPORT");
				Integer T_BAUDRATE = new Integer(props.getProperty("BAUDRATE"));
				BAUDRATE = T_BAUDRATE.intValue();
				MANUFACTURER = props.getProperty("MANUFACTURER");
				MODEL = props.getProperty("MODEL");
				is.close();
			}catch(Exception e){
				log.error("sendmessage_sgcc.properties 文件不正确或没有定义");
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}else if(initPropertyReadForm.equalsIgnoreCase("parameter")){
			//读取短信猫传入参数
			GATEWAYID = gatewayid;
			COMPORT = comport;
			BAUDRATE = baudrate;
			MANUFACTURER = manufacturer;
			MODEL = model;
		}
		initMessageService(GATEWAYID,COMPORT,BAUDRATE,MANUFACTURER,MODEL);
	}
	
	private void initMessageService(String GATEWAYID,String COMPORT,int BAUDRATE,String MANUFACTURER,String MODEL) throws TimeoutException, SMSLibException, IOException, InterruptedException {
		SerialModemGateway gateway = new SerialModemGateway(GATEWAYID, COMPORT, BAUDRATE, MANUFACTURER, MODEL);////创建Gateway
		gateway.setInbound(true); 
		gateway.setOutbound(true); 
		gateway.setSimPin("0000");//pin码
		
		messageService=new Service();//创建Service
		messageService.addGateway(gateway);//添加Gateway
		
		/*
		//读取、发送短信后的处理事件可以不定义，按需要使用
		OutboundNotification outboundNotification = new OutboundNotification();//发送短信后处理事件方法
		InboundNotification inboundNotification = new InboundNotification();//读取短信后处理事件方法
		messageService.setOutboundNotification(outboundNotification);//绑定发送短信后处理事件方法
		messageService.setInboundNotification(inboundNotification);//绑定读取短信后处理事件方法
		*/
		messageService.startService();//启动短信服务
		
	} 
	//在发送短信的时候只需以下  
	private String sendOut(String content,String mobile) throws TimeoutException, GatewayException, IOException, InterruptedException{ 
		OutboundMessage msg;        
		
		msg=new OutboundMessage(mobile,content); 
		msg.setEncoding(MessageEncodings.ENCUCS2);//（中文处理，一定要用）  
		messageService.sendMessage(msg); 
		return msg.getMessageStatus().toString().trim(); 
	} 
	
	@SuppressWarnings("unused")
	private String readMsg() throws TimeoutException, GatewayException, IOException, InterruptedException{
		ArrayList<InboundMessage> msgList = new ArrayList<InboundMessage>();
		log.info("********MSG NUM（短信总数）:"+messageService.readMessages(msgList, MessageClasses.ALL));
		 //messageService.readMessages(msgList, MessageClasses.ALL);
         for (int i=0;i<msgList.size();i++){
        	 InboundMessage msgTemp = (InboundMessage)(msgList.get(i));
        	 SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
        	 System.out.println("时间：" + df.format(msgTemp.getDate()));
        	 System.out.println("手机号：" + msgTemp.getOriginator());
        	 System.out.println("短信内容：" + msgTemp.getText());
        	 System.out.println("短信ID：" + msgTemp.getMessageId());
        	 System.out.println("gatewayId：" + msgTemp.getGatewayId());
         }

		return "";
	}
	@SuppressWarnings({ "finally", "unused" })
	private boolean deleteMsg(InboundMessage msgIn){
		boolean rtn = false;
		try {
			messageService.deleteMessage(msgIn);
			rtn = true;
		} catch (TimeoutException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (GatewayException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			return rtn;
		}
	}
}
class OutboundNotification implements IOutboundMessageNotification {
	public void process(String gatewayId, OutboundMessage msgTemp) {
		System.out.println("IOutboundMessageNotification handler called from Gateway(发出短信后): "
				+ gatewayId);
		if(msgTemp!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh-mm-ss");
			System.out.println("时间：" + df.format(msgTemp.getDate()));
			System.out.println("手机号：" + msgTemp.getFrom());
			System.out.println("getRefNo()：" + msgTemp.getRefNo());
			System.out.println("短信内容：" + msgTemp.getText());
			System.out.println("短信ID：" + msgTemp.getMessageId());
			System.out.println("gatewayId：" + msgTemp.getGatewayId());
		}
	}
}

class InboundNotification implements IInboundMessageNotification {
	public void process(String arg0, MessageTypes arg1, InboundMessage msgTemp) {
		// TODO Auto-generated method stub
		System.out.println("IInboundMessageNotification handler called from Gateway(收到短信后): "
				+ arg0);
		if(msgTemp!=null){
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh-mm-ss");
			System.out.println("时间：" + df.format(msgTemp.getDate()));
			System.out.println("手机号：" + msgTemp.getOriginator());
			System.out.println("短信内容：" + msgTemp.getText());
			System.out.println("短信ID：" + msgTemp.getMessageId());
			System.out.println("gatewayId：" + msgTemp.getGatewayId());
		}
		
	}
}

