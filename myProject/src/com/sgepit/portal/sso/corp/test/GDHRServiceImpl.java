package com.sgepit.portal.sso.corp.test;

public class GDHRServiceImpl {
	 public String getDeptById(String departid){
		 String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
		 		"<root>" +
			 		"<departs>" +
				 		"<department>" +
					 		"<code>15</code>" +
					 		"<description>经营班子</description>" +
					 		"<realsign></realsign>" +
					 		"<deptperson/>" +
					 		"<master/>" +
					 		"<ucode>1013</ucode>" +
					 		"<levelCode>01</levelCode>" +
					 		"<pptr/>" +
					 		"<cptr>0</cptr>" +
				 		"</department>" +
			 		"</departs>" +
		 		"</root>";
		 return res;
		 
	 }
    public String getDeptsByAll(){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
 		"<root>" +
	 		"<departs>" +
		 		"<department>" +
			 		"<code>15</code>" +
			 		"<description>经营班子</description>" +
			 		"<realsign></realsign>" +
			 		"<deptperson/>" +
			 		"<master/>" +
			 		"<ucode>1013</ucode>" +
			 		"<levelCode>01</levelCode>" +
			 		"<pptr/>" +
			 		"<cptr>0</cptr>" +
		 		"</department>" +
	 		"</departs>" +
 		"</root>";
		 return res;
    }
    public String getNewDepts(String time){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
 		"<root>" +
	 		"<departs>" +
		 		"<department>" +
			 		"<code>15</code>" +
			 		"<description>经营班子</description>" +
			 		"<realsign></realsign>" +
			 		"<deptperson/>" +
			 		"<master/>" +
			 		"<ucode>1013</ucode>" +
			 		"<levelCode>01</levelCode>" +
			 		"<pptr/>" +
			 		"<cptr>0</cptr>" +
		 		"</department>" +
	 		"</departs>" +
 		"</root>";
    	return res;
    	
    }
    public String getNewPeoples(String time){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
					"<root>" +
						"<success>1</success>" +
						"<errcode></errcode>" +
						"<message></message>" +
						"<persons>" +
			    			"<person>" +
				    			"<pid>1231119</pid>" +
				    			"<name>HR测试2</name>" +
				    			"<sex>男</sex>" +
				    			"<Ucode>1064</Ucode>" +
				    			"<Dcode>15</Dcode>" +
				    			"<gangwei>文秘</gangwei>" +
				    			"<ts>2010-12-23 14:36:38</ts>" +
				    			"<Status>0</Status>" +
				    			"<loginid>Hrtest2</loginid>" +
			    			"</person>" +
						"</persons>" +
					"</root> ";
    	return res;
    }
    public String getPeopleById(String personid){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
					"<root>" +
						"<success>1</success>" +
						"<errcode></errcode>" +
						"<message></message>" +
						"<persons>" +
			    			"<person>" +
				    			"<pid>1231119</pid>" +
				    			"<name>HR测试2</name>" +
				    			"<sex>男</sex>" +
				    			"<Ucode>1064</Ucode>" +
				    			"<Dcode>15</Dcode>" +
				    			"<gangwei>文秘</gangwei>" +
				    			"<ts>2010-12-23 14:36:38</ts>" +
				    			"<Status>0</Status>" +
				    			"<loginid>Hrtest2</loginid>" +
			    			"</person>" +
						"</persons>" +
					"</root> ";
    	return res;
    }
    public String getPeoplesCount(){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?><root><success>1</success><errcode/><message/><count>100</count></root> ";
    	System.out.println(res);
    	return res;
    }
    public String getPeoplesByAll(int start, int max){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
		"<root>" +
			"<success>1</success>" +
			"<errcode></errcode>" +
			"<message></message>" +
			"<persons>" +
    			"<person>" +
	    			"<pid>1231009</pid>" +
	    			"<name>HR测试</name>" +
	    			"<sex>男</sex>" +
	    			"<Ucode>1064</Ucode>" +
	    			"<Dcode>15</Dcode>" +
	    			"<gangwei>文秘</gangwei>" +
	    			"<ts>2010-12-23 14:36:38</ts>" +
	    			"<Status>0</Status>" +
	    			"<loginid>Hrtest</loginid>" +
    			"</person>" +
			"</persons>" +
		"</root> ";
    	return res;
    }
    public String getNewUnits(String time){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
    			"<root>" +
	    			"<success>1</success>" +
	    			"<errcode></errcode>" +
	    			"<message></message>" +
	    			"<units>" +
		    			"<unit>" +
			    			"<descripiton>山西国际电力兴县发电项目筹备处</descripiton>" +
			    			"<code>1064</code>" +
			    			"<Short_name>山西国际电力兴县发电项目筹备处</Short_name>" +
			    			"<person/>" +
			    			"<parentUtil>1063</parentUtil>" +
			    			"<Shareholdings>N</Shareholdings>" +
			    			"<belongto></belongto>" +
			    			"<Ustate>N</Ustate>" +
			    			"<levelCode>10311</levelCode>" +
			    			"<pptr>103</pptr>" +
			    			"<cptr>0</cptr>" +
		    			"</unit>" +
	    			"</units>" +
    			"</root>";
    	return res;
    }
    public String getUnitsByAll(){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
		"<root>" +
			"<success>1</success>" +
			"<errcode></errcode>" +
			"<message></message>" +
			"<units>" +
    			"<unit>" +
	    			"<descripiton>山西国际电力兴县发电项目筹备处</descripiton>" +
	    			"<code>1064</code>" +
	    			"<Short_name>山西国际电力兴县发电项目筹备处</Short_name>" +
	    			"<person/>" +
	    			"<parentUtil>1063</parentUtil>" +
	    			"<Shareholdings>N</Shareholdings>" +
	    			"<belongto></belongto>" +
	    			"<Ustate>N</Ustate>" +
	    			"<levelCode>10311</levelCode>" +
	    			"<pptr>103</pptr>" +
	    			"<cptr>0</cptr>" +
    			"</unit>" +
			"</units>" +
		"</root>";
    	return res;
    	
    }
    public String getUnitsById(String unitid){
    	String res = "<?xml version=\"1.0\" encoding=\"GB2312\"?>" +
		"<root>" +
			"<success>1</success>" +
			"<errcode></errcode>" +
			"<message></message>" +
			"<units>" +
    			"<unit>" +
	    			"<descripiton>山西国际电力兴县发电项目筹备处</descripiton>" +
	    			"<code>1064</code>" +
	    			"<Short_name>山西国际电力兴县发电项目筹备处</Short_name>" +
	    			"<person/>" +
	    			"<parentUtil>1063</parentUtil>" +
	    			"<Shareholdings>N</Shareholdings>" +
	    			"<belongto></belongto>" +
	    			"<Ustate>N</Ustate>" +
	    			"<levelCode>10311</levelCode>" +
	    			"<pptr>103</pptr>" +
	    			"<cptr>0</cptr>" +
    			"</unit>" +
			"</units>" +
		"</root>";
    	return res;
    }
}
