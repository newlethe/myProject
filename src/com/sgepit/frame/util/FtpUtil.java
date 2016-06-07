package com.sgepit.frame.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

import com.enterprisedt.net.ftp.FTPClient;
import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;
import com.enterprisedt.net.ftp.FTPFile;
import com.enterprisedt.net.ftp.FTPTransferType;

/**
 * 工具类：FTP
 * 
 * @author xjdawu
 * @since 2008.3.6
 */

public class FtpUtil {
	private static String host = "";
	private static String port = "";
	private static String user = "";
	private static String password = "";
	private static String connectmode = "";
	private static String remoteRoot = "";
	
	static {
		try {
			InputStream is = FtpUtil.class.getResourceAsStream("/system.properties");
			Properties p = new Properties();
			p.load(is);
			host = p.getProperty("FTP_HOST");
			port = p.getProperty("FTP_PORT");
			user = p.getProperty("FTP_USER");
			password = p.getProperty("FTP_PASSWORD");
			connectmode = p.getProperty("FTP_CONNECTMODE")==null?"PASV":p.getProperty("FTP_CONNECTMODE");
			remoteRoot = p.getProperty("FTP_USERDIR");
			
			System.out.println(host);
			System.out.println(port);
			System.out.println(user);
			System.out.println(connectmode);
			System.out.println(remoteRoot);
			is.close();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void ftpPut(InputStream fis, String rfilename,String transType) throws IOException, FTPException{
		FTPClient ftp = null;
		ftp = new FTPClient();
		ftp.setRemoteHost(host);
		ftp.setRemotePort(Integer.parseInt(port));
		ftp.connect();
		ftp.login(user, password);
		if (connectmode.trim().toUpperCase().equalsIgnoreCase("ACTIVE")) {
			ftp.setConnectMode(FTPConnectMode.ACTIVE);
		} else {
			ftp.setConnectMode(FTPConnectMode.PASV);
		}
		ftp.setType(FTPTransferType.BINARY);
		String path = "";
		try {
			path = remoteRoot;
			if(!"".equals(transType)){
				path += "/"+transType;
			}
			ftp.chdir(path);
			System.out.println("*FtpPut*path:"+path);
		} catch (FTPException ex) {
			int begin = 1;
			int next = 0;
			ftp.chdir("/");
			while ((next = path.indexOf("/", begin)) != -1) {
				String s = path.substring(begin, next);
				begin = next + 1;
				try {
					ftp.chdir(s);
				} catch (FTPException exc) {
					ftp.mkdir(s);
					ftp.chdir(s);
				}
			}
			ftp.mkdir(path.substring(begin));
			ftp.chdir(path);
			System.out.println("*FtpPut*path:"+path);
		}
		ftp.put(fis, rfilename);
		ftp.quit();
	}
	
	public static void ftpPut(byte[] fileByte, String rfilename,String transType) throws IOException, FTPException{
		FTPClient ftp = null;
		ftp = new FTPClient();
		ftp.setRemoteHost(host);
		ftp.setRemotePort(Integer.parseInt(port));
		ftp.connect();
		ftp.login(user, password);
		if (connectmode.trim().toUpperCase().equalsIgnoreCase("ACTIVE")) {
			ftp.setConnectMode(FTPConnectMode.ACTIVE);
		} else {
			ftp.setConnectMode(FTPConnectMode.PASV);
		}
		ftp.setType(FTPTransferType.BINARY);
		String path = "";
		try {
			path = remoteRoot;
			if(!"".equals(transType)){
				path += "/"+transType;
			}
			ftp.chdir(path);
			System.out.println("*FtpPut*path:"+path);
		} catch (FTPException ex) {
			int begin = 1;
			int next = 0;
			ftp.chdir("/");
			while ((next = path.indexOf("/", begin)) != -1) {
				String s = path.substring(begin, next);
				begin = next + 1;
				try {
					ftp.chdir(s);
				} catch (FTPException exc) {
					ftp.mkdir(s);
					ftp.chdir(s);
				}
			}
			ftp.mkdir(path.substring(begin));
			ftp.chdir(path);
			System.out.println("*FtpPut*path:"+path);
		}
		ftp.put(fileByte, rfilename);
		ftp.quit();
	}
	
	/**
	 * 根据文件类型（确切路径）获得文档，不查询子文档
	 * @param fos
	 * @param rfilename
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:33:09
	 */
	public static void ftpGet(OutputStream fos, String rfilename,String transType) {
		FTPClient ftp = null;
		try {
			ftp = new FTPClient();
            ftp.setRemoteHost(host);
            ftp.setRemotePort(Integer.parseInt(port));
            ftp.connect();
            ftp.login(user, password);
            if (connectmode.trim().toUpperCase().equalsIgnoreCase("ACTIVE")) {
            	ftp.setConnectMode(FTPConnectMode.ACTIVE);
            } else {
            	ftp.setConnectMode(FTPConnectMode.PASV);
            }
            ftp.setType(FTPTransferType.BINARY);
            String path = "";
            try {
            	//String year = rfilename.substring(0,4);
            	//String month = rfilename.substring(4,6);
            	//path = remoteRoot.concat("/" + year + "/" + month);
            	path = remoteRoot;
            	if(transType!=null && !transType.equals("")){
            		path += "/" + transType;
            	}
            	ftp.chdir(path);
            } catch (FTPException ex) {
            	ex.printStackTrace();
            }
            ftp.get(fos, rfilename);
            ftp.quit();
		} catch (Exception  e) {
			System.out.println("Exception:" + FtpUtil.class.getName());
			e.printStackTrace();
		}
	}
	/**
	 * 根据文件类型（确切路径）获得文档，不查询子文档
	 * @param fos
	 * @param rfilename
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:33:09
	 */
	public static byte[] ftpGet(String rfilename,String transType) {
		byte[] outByte = null;
		FTPClient ftp = null;
		try {
			ftp = new FTPClient();
			ftp.setRemoteHost(host);
			ftp.setRemotePort(Integer.parseInt(port));
			ftp.connect();
			ftp.login(user, password);
			if (connectmode.trim().toUpperCase().equalsIgnoreCase("ACTIVE")) {
				ftp.setConnectMode(FTPConnectMode.ACTIVE);
			} else {
				ftp.setConnectMode(FTPConnectMode.PASV);
			}
			ftp.setType(FTPTransferType.BINARY);
			String path = "";
			try {
				//String year = rfilename.substring(0,4);
				//String month = rfilename.substring(4,6);
				//path = remoteRoot.concat("/" + year + "/" + month);
				path = remoteRoot;
				if(!"".equals(transType)){
					path += "/" + transType;
				}
				ftp.chdir(path);
			} catch (FTPException ex) {
				ex.printStackTrace();
			}
			outByte = ftp.get(rfilename);
			ftp.quit();
			return outByte;
		} catch (Exception  e) {
			System.out.println("Exception:" + FtpUtil.class.getName());
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 从ftp获得文档，并查询子文档
	 * @param fos
	 * @param rfilename
	 * @throws IOException
	 * @throws FTPException
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:32:32
	 */
	public static void ftpGet(OutputStream fos, String rfilename) throws IOException, FTPException{
		FTPClient ftp = null;
		ftp = new FTPClient();
		ftp.setRemoteHost(host);
		ftp.setRemotePort(Integer.parseInt(port));
		ftp.connect();
		ftp.login(user, password);
		if (connectmode.trim().toUpperCase().equalsIgnoreCase("ACTIVE")) {
			ftp.setConnectMode(FTPConnectMode.ACTIVE);
		} else {
			ftp.setConnectMode(FTPConnectMode.PASV);
		}
		ftp.setType(FTPTransferType.BINARY);
		String path = "";
		path = remoteRoot;
		getFtpFile(fos, ftp, path, rfilename);
		ftp.quit();
	}

	/**
	 * 根据文件类型（确切路径）删除文档，不查询子文档
	 * @param rfilename
	 * @param transType
	 * @throws IOException
	 * @throws FTPException
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:27:54
	 */
	public static void ftpDel(String rfilename,String transType) throws IOException, FTPException{
		FTPClient ftp = null;
		ftp = new FTPClient();
		ftp.setRemoteHost(host);
		ftp.setRemotePort(Integer.parseInt(port));
		ftp.connect();
		ftp.login(user, password);
		String path = "";
		try {
			path = remoteRoot;
			if(!"".equals(transType)){
        		path += "/" + transType;
        	}
			ftp.chdir(path);
		} catch (FTPException ex) {
			ex.printStackTrace();
		}
		ftp.delete(rfilename);
		ftp.quit();
	}
	

	/**
	 * 遍历文件夹删除文档，如果找到 删除后不再查找
	 * @param rfilename
	 * @throws IOException
	 * @throws FTPException
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:32:27
	 */
	public static void ftpDel(String rfilename) throws IOException, FTPException{
		FTPClient ftp = null;
		ftp = new FTPClient();
		ftp.setRemoteHost(host);
		ftp.setRemotePort(Integer.parseInt(port));
		ftp.connect();
		ftp.login(user, password);
		String path = remoteRoot;
		delFtpFile( ftp, path, rfilename);
		ftp.quit();
	}
	
	//**********************private method***********************************************************************
	
	/**
	 * 遍历查询
	 * @param fos
	 * @param ftp
	 * @param path
	 * @param rfilename
	 * @return
	 * @throws IOException
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:38:51
	 */
	private static boolean getFtpFile(OutputStream fos, FTPClient ftp,String path,String rfilename)throws IOException{
		try {
			ftp.chdir(path);
			System.out.println("**"+path);
			ftp.get(fos, rfilename);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			boolean rtn = false;
			try {
				FTPFile[] files = ftp.dirDetails(path);
				if(files.length>2){
					for (int i = 2; i < files.length; i++) {
						String o_path = path +"/"+files[i].getName();
						rtn = getFtpFile(fos, ftp, o_path, rfilename);
						System.out.println(rtn);
						if(rtn) break;
					}
				}
				
				return rtn;
			} catch (Exception ex) {
				ex.printStackTrace();
				return rtn;
			}
		}
	}
	
	
	/**
	 * 遍历删除
	 * @param ftp
	 * @param path
	 * @param rfilename
	 * @return
	 * @throws IOException
	 * @author Shirley 
	 * @createTime 2010-1-6 下午05:38:39
	 */
	private static boolean delFtpFile(FTPClient ftp,String path,String rfilename)throws IOException{
		try {
			ftp.chdir(path);
			System.out.println("**"+path);
			ftp.delete(rfilename);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			boolean rtn = false;
			try {
				FTPFile[] files = ftp.dirDetails(path);
				if(files.length>2){
					for (int i = 2; i < files.length; i++) {
						String o_path = path +"/"+files[i].getName();
						rtn = delFtpFile(ftp, o_path, rfilename);
						if(rtn) break;
					}
				}
				
				return rtn;
			} catch (Exception ex) {
				ex.printStackTrace();
				return rtn;
			}
		}
	}
	

	public static InputStream getFile(String fileid, String compress) {
		// TODO Auto-generated method stub
		return null;
	}	
	
}