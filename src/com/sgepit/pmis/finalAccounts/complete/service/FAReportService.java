/**
 * 
 */
package com.sgepit.pmis.finalAccounts.complete.service;

/**
 * @author qiupy 2013-7-24 
 *
 */
public interface FAReportService {

	public String initFacompBdgInfoReport2(Boolean force,String pid);
	public String initFacompTransferAssetsR4(Boolean force,String pid);
	public String initFacompTransferAssetsR41(Boolean force,String pid);
	public String initFacompTransferAssetsR42(Boolean force,String pid);
	public String initFacompTransferAssetsR43(Boolean force,String pid);
	public String initFacompTransferAssetsR44(Boolean force,String pid);
	public String getFacompDtfyContDetail3FXml(String pid);
	public String initFacompDtfyContDetail3(Boolean force,String pid);
	public String initFacompOtherCostReport3(Boolean force,String pid);
}
