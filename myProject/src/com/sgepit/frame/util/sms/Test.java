package com.sgepit.frame.util.sms;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Properties;

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
import org.smslib.modem.SerialModemGateway;

public class Test {
	private static Service messageService; 
	private InputStreamReader reader;
	private BufferedReader input;

	public Test() {
		super();
		// TODO Auto-generated constructor stub
		reader = new InputStreamReader(System.in);
		input = new BufferedReader(reader);
	}
	
	public static void main(String[] args) throws Exception{
		Test t = new Test();
		try {
		    t.chooseFunc();
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
		}
	}
	private void chooseFunc () throws IOException, InterruptedException, SMSLibException{
		System.out.println("smslib test!!!");
		System.out.println("(1) Check Service Status");
		System.out.println("(2) Start Service");
		System.out.println("(3) Stop Service");
		System.out.println("(4) Read Message");
		System.out.println("(5) Send Message");
		System.out.println("Choose and enter the number between \"(\" and \")\":");
//	    String s = choose==null?"":choose; 
	    String s = input.readLine();/*执行输入流操作*/ 
	    if(s.equals("1")){
	    	checkServiceStatus();
	    }else if(s.equals("2")){
	    	startService();
	    }else if(s.equals("3")){
			stopService();
	    }else if(s.equals("4")){
	    	readMessage();
	    }else if(s.equals("5")){
	    	sendMessage();
	    }
	    System.out.println();
	    chooseFunc();
	}
	private void checkServiceStatus() {
		// TODO Auto-generated method stub
		if(messageService!=null){
			System.out.println("messageService.getSettings() "+messageService.getSettings());
			System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
		}else{
			System.out.println("The sms service has not init yet!!!");
		}
		return;
	}
	private void startService() throws TimeoutException, SMSLibException, IOException, InterruptedException {
		// TODO Auto-generated method stub
    	System.out.println("initMessageService begin");
    	this.initMessageService();
    	System.out.println("initMessageService end");
    	System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	private void stopService() throws TimeoutException, GatewayException, IOException, InterruptedException {
		// TODO Auto-generated method stub
		System.out.println("stopService begin");
		messageService.stopService();
		System.out.println("stopService end");
		System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	private void readMessage() throws TimeoutException, GatewayException, IOException, InterruptedException {
		// TODO Auto-generated method stub
		System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
    	System.out.println("readMsg() begin");
    	this.readMsg();
    	System.out.println("readMsg() end");
    	System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	private void sendMessage() throws IOException, TimeoutException, GatewayException, InterruptedException {
		// TODO Auto-generated method stub
	    System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
    	System.out.println("Phone Number:");
    	String phonenum = input.readLine();/*执行输入流操作*/ 
    	System.out.println("Sms Content:");
	    String smscontent = input.readLine();/*执行输入流操作*/ 
	    System.out.println("Send Message begin");
	    this.sendOut(smscontent, phonenum);
	    System.out.println("end Message end");
	    System.out.println("messageService.getServiceStatus() "+messageService.getServiceStatus());
	}
	private void initMessageService() throws TimeoutException, SMSLibException, IOException, InterruptedException {
		initMessageService("default");
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
				System.out.println("sendmessage_sgcc.properties 文件不正确或没有定义");
				e.printStackTrace();
			}
		}else if(initPropertyReadForm.equalsIgnoreCase("properties")){
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
		SerialModemGateway gateway = new SerialModemGateway("modem.com1", "COM1", 9600, "wavecom", null);////创建Gateway
		gateway.setInbound(true); 
		gateway.setOutbound(true); 
		gateway.setSimPin("0000");//pin码
		
		messageService=new Service();//创建Service
		messageService.addGateway(gateway);//添加Gateway
		//读取、发送短信后的处理事件可以不定义，按需要使用
		OutboundNotification outboundNotification = new OutboundNotification();//发送短信后处理事件方法
		InboundNotification inboundNotification = new InboundNotification();//读取短信后处理事件方法
		messageService.setOutboundNotification(outboundNotification);//绑定发送短信后处理事件方法
		messageService.setInboundNotification(inboundNotification);//绑定读取短信后处理事件方法
		
		messageService.startService();//启动短信服务
		
	} 
	//在发送短信的时候只需以下  
	private String sendOut(String content,String mobiles) throws TimeoutException, GatewayException, IOException, InterruptedException{ 
		String output=""; 
		String[] phones=mobiles.split(";"); 
		OutboundMessage msg;        
		
		for(int i=0;i<phones.length;i++){ 
			msg=new OutboundMessage(phones[i],content); 
			msg.setEncoding(MessageEncodings.ENCUCS2);//（中文处理，一定要用）  
			messageService.sendMessage(msg); 
			output=output+"["+"<"+phones[i]+">"+"发送成功,"+"]"; 
		} 
		return output; 
	} 
	@SuppressWarnings("unused")
	private String readMsg() throws TimeoutException, GatewayException, IOException, InterruptedException{
		ArrayList<InboundMessage> msgList = new ArrayList<InboundMessage>();
		 System.out.println("********MSG NUM（短信总数）:"+messageService.readMessages(msgList, MessageClasses.ALL));
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
